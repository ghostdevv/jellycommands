import { createRequest } from '../../util/request';
import type { BaseOptions } from './base/options';
import { BaseCommand } from './base/BaseCommand';
import { CommandCache } from './CommandCache';
import { Routes } from 'discord-api-types/v9';
import { flattenPaths } from 'ghoststools';
import { readJSFile } from '../../util/fs';

import type { GuildApplicationPermissionData } from '../../types/applicationCommands.d';
import type { ApplicationCommand } from '../../types/applicationCommands.d';
import type { JellyCommands } from '../JellyCommands';
import type { Guild, Interaction } from 'discord.js';

export class ApplicationCommandManager {
    private client;
    private commands;

    constructor(
        client: JellyCommands,
        commands: Map<string, BaseCommand<BaseOptions>>,
    ) {
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

    static async getCommandFiles(paths: string | string[]) {
        const guildCommands = new Map<string, BaseCommand<BaseOptions>[]>();
        const globalCommands = new Set<BaseCommand<BaseOptions>>();
        const commandsList = new Set<BaseCommand<BaseOptions>>();

        for (const file of flattenPaths(paths)) {
            const command = await readJSFile<BaseCommand<BaseOptions>>(file);
            if (command.options?.disabled) continue;

            /**
             * Set the command path
             */
            command.filePath = file;

            /**
             * If global add to global
             */
            if (command.options?.global) globalCommands.add(command);

            /**
             * If the command is not global set to guild commands
             */
            if (command.options?.guilds && !command.options?.global)
                for (const guildId of command.options.guilds)
                    guildCommands.set(guildId, [
                        ...(guildCommands.get(guildId) || []),
                        command,
                    ]);

            commandsList.add(command);
        }

        return {
            guildCommands,
            globalCommands,
            commandsList,
        };
    }

    static toCommandsMap(commandsList: Set<BaseCommand<BaseOptions>>) {
        const commandsMap = new Map<string, BaseCommand<BaseOptions>>();

        for (const command of commandsList)
            commandsMap.set(command.id || '', command);

        return commandsMap;
    }

    static async create(client: JellyCommands, paths: string | string[]) {
        const { clientId, token } = client.getAuthDetails();
        const request = createRequest(token);
        const cache = new CommandCache();

        const { guildCommands, globalCommands, commandsList } =
            await ApplicationCommandManager.getCommandFiles(paths);

        // if (cache.validate({ guildCommands, globalCommands })) {
        //     console.log('Cache is valid');
        //     return {};
        // }

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
                gcommands.map((c) => c.applicationCommandData),
            );

            /**
             * Map returned command ids to their corresponding command
             */
            res.forEach((c, i) => (gcommands[i].id = c.id));
        }

        /**
         * For each guild command set permissions
         */
        for (const [guildId, commands] of guildCommands) {
            const permissionData: GuildApplicationPermissionData[] = [];

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
         * Update the cache
         */
        cache.set({ guildCommands, globalCommands });

        return new ApplicationCommandManager(
            client,
            ApplicationCommandManager.toCommandsMap(commandsList),
        );
    }
}
