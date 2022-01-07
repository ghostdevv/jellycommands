import { readJSFile, readFiles } from '../../util/fs';
import { createRequest } from '../../util/request';
import { BaseCommand } from './base/BaseCommand';
import { CommandCache } from './CommandCache';
import { CommandIdMap } from './CommandIdMap';
import { Routes } from 'discord-api-types/v9';

import type {
    commandsList,
    guildCommands,
    commandIdMap,
    globalCommands,
} from '../../types/commands.d';

import type { RESTPutAPIGuildApplicationCommandsPermissionsJSONBody } from 'discord-api-types';
import type { ApplicationCommand } from '../../types/rawCommands';
import type { JellyCommands } from '../JellyCommands';
import { Interaction } from 'discord.js';

export class CommandManager {
    private client;
    private commands;

    constructor(client: JellyCommands, commands: commandIdMap) {
        this.client = client;
        this.commands = commands;
    }

    async respond(interaction: Interaction): Promise<void> {
        if (!(interaction.isCommand() || interaction.isContextMenu())) return;

        const command = this.commands.get(interaction.commandId);

        /**
         * If command is not found return - if unknownCommand message send
         */
        if (!command)
            return void (
                this.client.joptions.messages?.unknownCommand &&
                interaction.reply(this.client.joptions.messages.unknownCommand)
            );

        const options = command.options;

        /**
         * If defer, defer
         */
        if (options.defer)
            await interaction.deferReply(
                typeof options.defer == 'object' ? options.defer : {},
            );

        /**
         * Run the command
         */
        command.run({
            client: this.client,
            interaction,
        });
    }

    static async getCommandFiles(
        paths: string | string[],
        devGuilds: string[] = [],
    ) {
        const guildCommands: guildCommands = new Map();
        const globalCommands: globalCommands = new Set();
        const commandsList: commandsList = new Set();

        for (const file of readFiles(paths)) {
            const command = await readJSFile<BaseCommand>(file);
            if (command.options?.disabled) continue;

            /**
             * If in dev mode update guilds
             */
            if (command.options?.dev)
                command.options.guilds = [
                    ...(command.options?.guilds || []),
                    ...devGuilds,
                ];

            /**
             * Set the command path
             */
            command.filePath = file;

            /**
             * If global and not in dev mode add to global
             */
            if (command.options?.global && !command.options.dev)
                globalCommands.add(command);

            /**
             * If the command is not global set to guild commands
             */
            if (command.options?.guilds && !command.options?.global)
                for (const guildId of command.options.guilds) {
                    const existing: commandsList =
                        guildCommands.get(guildId) || new Set();

                    existing.add(command);

                    guildCommands.set(guildId, existing);
                }

            /**
             * Add to main commandlist
             */
            commandsList.add(command);
        }

        return {
            guildCommands,
            globalCommands,
            commandsList,
        };
    }

    static toCommandsMap(commandsList: commandsList) {
        const commandsMap: commandIdMap = new Map();

        for (const command of commandsList)
            commandsMap.set(command.id || '', command);

        return commandsMap;
    }

    static async create(client: JellyCommands, paths: string | string[]) {
        const { clientId, token } = client.getAuthDetails();
        const request = createRequest(token);
        const cache = new CommandCache();
        const idMap = new CommandIdMap();

        const { guildCommands, globalCommands, commandsList } =
            await CommandManager.getCommandFiles(
                paths,
                client.joptions.dev?.guilds,
            );

        if (client.joptions.cache) {
            client.debug('Loading Cache');

            if (cache.validate({ guildCommands, globalCommands })) {
                client.debug('Cache is valid');

                const commandMap = idMap.get(commandsList);
                return new CommandManager(client, commandMap);
            }
        }

        /**
         * Register global commands
         */
        const registeredGlobalCommands = await request<ApplicationCommand[]>(
            'put',
            Routes.applicationCommands(clientId),
            [...globalCommands].map((c) => c.applicationCommandData),
        );

        /**
         * Map returned command ids to their corresponding command
         */
        registeredGlobalCommands.forEach(
            (c, i) => ([...globalCommands][i].id = c.id),
        );

        /**
         * Register guild commands
         */
        for (const [guildId, gcommands] of guildCommands) {
            const res = await request<ApplicationCommand[]>(
                'put',
                Routes.applicationGuildCommands(clientId, guildId),
                [...gcommands].map((c) => c.applicationCommandData),
            );

            /**
             * Map returned command ids to their corresponding command
             */
            res.forEach((c, i) => ([...gcommands][i].id = c.id));
        }

        /**
         * For each guild command set permissions
         */
        for (const [guildId, commands] of guildCommands) {
            const permissionData: RESTPutAPIGuildApplicationCommandsPermissionsJSONBody[] =
                [];

            for (const command of commands)
                if (command.applicationCommandPermissions)
                    permissionData.push({
                        id: command.id || '',
                        permissions: command.applicationCommandPermissions,
                    });

            await request(
                'put',
                Routes.guildApplicationCommandsPermissions(clientId, guildId),
                permissionData,
            );
        }

        /**
         * Update the cache & id map
         */
        if (client.joptions.cache) {
            cache.set({ guildCommands, globalCommands });
            idMap.set(commandsList);

            client.debug('Cache has been updated');
            client.debug('Id Map has been updated');
        }

        return new CommandManager(
            client,
            CommandManager.toCommandsMap(commandsList),
        );
    }
}
