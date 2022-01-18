import { readJSFile, readFiles } from '../../util/fs';
import { createRequest } from '../../util/request';
import { BaseCommand } from './base/BaseCommand';
import { Routes } from 'discord-api-types/v9';

import type { RESTPutAPIGuildApplicationCommandsPermissionsJSONBody } from 'discord-api-types/v9';
import type { APIApplicationCommand } from 'discord-api-types/v9';
import type { JellyCommands } from '../JellyCommands';
import type { Interaction } from 'discord.js';

export type CommandIDMap = Map<string, BaseCommand>;
export type CommandMap = Map<string, BaseCommand>;

export type GlobalCommands = BaseCommand[];
export type GuildCommandsMap = Map<string, Set<BaseCommand>>;

export class CommandManager {
    private client;
    private commands;

    constructor(client: JellyCommands, commands: CommandIDMap) {
        this.client = client;
        this.commands = commands;
    }

    async respond(interaction: Interaction): Promise<void> {
        if (!(interaction.isCommand() || interaction.isContextMenu())) return;

        const command = this.commands.get(interaction.commandId);

        // If command is not found return - if unknownCommand message send
        if (!command)
            return void (
                this.client.joptions.messages?.unknownCommand &&
                interaction.reply(this.client.joptions.messages.unknownCommand)
            );

        const options = command.options;

        // If defer, defer
        if (options.defer)
            await interaction.deferReply(
                typeof options.defer == 'object' ? options.defer : {},
            );

        // Run the command
        command.run({
            client: this.client,
            interaction,
        });
    }

    static async readCommands(
        paths: string | string[],
        devGuilds: string[] = [],
    ) {
        const commands: CommandMap = new Map();

        const guildCommands: GuildCommandsMap = new Map();
        const globalCommands = new Set<BaseCommand>();

        for (const path of readFiles(paths)) {
            const command = await readJSFile<BaseCommand>(path);
            if (command.options?.disabled) continue;

            // Add command to command list
            commands.set(path, command);

            // If in dev mode update guilds
            if (command.options?.dev)
                command.options.guilds = [
                    ...(command.options?.guilds || []),
                    ...devGuilds,
                ];

            // Set the command path
            command.filePath = path;

            // If global and not in dev mode add to global
            if (command.options?.global && !command.options.dev)
                globalCommands.add(command);

            // If the command is not global set to guild commands
            if (command.options?.guilds && !command.options?.global)
                for (const guildId of command.options.guilds) {
                    const existing =
                        guildCommands.get(guildId) || new Set<BaseCommand>();

                    existing.add(command);

                    guildCommands.set(guildId, existing);
                }
        }

        return {
            guildCommands,
            globalCommands: Array.from(globalCommands) as GlobalCommands,
            commands,
        };
    }

    static async registerCommands(
        client: JellyCommands,
        globalCommands: GlobalCommands,
        guildCommands: GuildCommandsMap,
    ): Promise<CommandIDMap> {
        const { clientId, token } = client.getAuthDetails();
        const request = createRequest(token);

        const commandIdMap: CommandIDMap = new Map();

        // Register global commands
        const registeredGlobalCommands = await request<APIApplicationCommand[]>(
            'put',
            Routes.applicationCommands(clientId),
            globalCommands.map((c) => c.applicationCommandData),
        );

        // Map returned command ids to their corresponding command
        registeredGlobalCommands.forEach((command, i) =>
            commandIdMap.set(command.id, globalCommands[i]),
        );

        // Loop over each guild
        for (const [guildId, commands] of guildCommands) {
            const commandsArray = Array.from(commands);

            // Register commands for the guild
            const res = await request<APIApplicationCommand[]>(
                'put',
                Routes.applicationGuildCommands(clientId, guildId),
                commandsArray.map((c) => c.applicationCommandData),
            );

            const permissionData: RESTPutAPIGuildApplicationCommandsPermissionsJSONBody =
                [];

            for (let i = 0; i < res.length; i++) {
                const command = commandsArray[i];
                const apiCommand = res[i];

                // Set the command id map
                commandIdMap.set(apiCommand.id, command);

                const permissions = command.applicationCommandPermissions;

                // Update permissions list
                if (permissions)
                    permissionData.push({
                        id: apiCommand.id,
                        permissions,
                    });
            }

            // Set the permissions
            await request(
                'put',
                Routes.guildApplicationCommandsPermissions(clientId, guildId),
                permissionData,
            );
        }

        return commandIdMap;
    }

    static async create(client: JellyCommands, paths: string | string[]) {
        const { guildCommands, globalCommands, commands } =
            await CommandManager.readCommands(
                paths,
                client.joptions.dev?.guilds,
            );

        // If cache is enabled, check it
        if (client.joptions.cache) {
            client.debug('Loading Cache');

            // if (cache.validate({ guildCommands, globalCommands })) {
            //     client.debug('Cache is valid');

            //     const commandMap = idMap.get(commandsList);
            //     return new CommandManager(client, commandMap);
            // }
        }

        // Register the commands against discord api
        const commandIdMap = await CommandManager.registerCommands(
            client,
            globalCommands,
            guildCommands,
        );

        /**
         * Update the cache & id map
         */
        if (client.joptions.cache) {
            // cache.set({ guildCommands, globalCommands });
            // idMap.set(commandsList);

            client.debug('Cache has been updated');
            client.debug('Id Map has been updated');
        }

        return new CommandManager(client, commandIdMap);
    }
}
