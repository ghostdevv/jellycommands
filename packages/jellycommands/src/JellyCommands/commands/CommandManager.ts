import type { RESTPutAPIGuildApplicationCommandsPermissionsJSONBody } from 'discord-api-types/v9';
import { CommandCache, CommandIdResolver } from './CommandPersistance';
import type { APIApplicationCommand } from 'discord-api-types/v9';
import type { JellyCommands } from '../JellyCommands';
import { readJSFile, readFiles } from '../../util/fs';
import { createRequest } from '../../util/request';
import { BaseCommand } from './base/BaseCommand';
import type { Interaction } from 'discord.js';
import { Routes } from 'discord-api-types/v9';

export type CommandIDMap = Map<string, BaseCommand>;
export type CommandMap = Map<string, BaseCommand>;

export type GlobalCommands = BaseCommand[];
export type GuildCommandsMap = Map<string, BaseCommand[]>;

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
        client: JellyCommands,
    ): Promise<{
        commands: CommandMap;
        globalCommands: GlobalCommands;
        guildCommands: GuildCommandsMap;
    }> {
        const commands: CommandMap = new Map();

        const guildCommands = new Map<string, Set<BaseCommand>>();
        const globalCommands = new Set<BaseCommand>();

        for (const path of readFiles(paths)) {
            const command = await readJSFile<BaseCommand>(path);

            // Skip this command if it's disabled
            if (command.options?.disabled) continue;

            // Dev mode is either per command or global
            const devMode = client.joptions.dev?.global || command.options.dev;

            // All the guilds that dev commands should be registered in
            const devGuilds = client.joptions.dev?.guilds || [];

            // Enable dev if global dev or local dev mode is on
            if (devMode) {
                // Set dev mode on the command itself
                command.options.dev = true;

                // Global needs to be disabled if in dev mode
                command.options.global = false;

                // Update the guilds
                command.options.guilds = [
                    ...(command.options?.guilds || []),
                    ...devGuilds,
                ];
            }

            // Add command to command list
            commands.set(command.hashId, command);

            // If global add it to global commands
            if (command.options?.global) globalCommands.add(command);

            // If has guilds loop over them and add to guild commands
            if (command.options?.guilds)
                for (const guildId of command.options.guilds) {
                    const existing =
                        guildCommands.get(guildId) || new Set<BaseCommand>();

                    existing.add(command);

                    guildCommands.set(guildId, existing);
                }
        }

        const guildCommandsMap: GuildCommandsMap = new Map();

        for (const [guildId, commands] of guildCommands)
            guildCommandsMap.set(guildId, Array.from(commands));

        return {
            guildCommands: guildCommandsMap,
            globalCommands: Array.from(globalCommands),
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
            // Register commands for the guild
            const res = await request<APIApplicationCommand[]>(
                'put',
                Routes.applicationGuildCommands(clientId, guildId),
                commands.map((c) => c.applicationCommandData),
            );

            const permissionData: RESTPutAPIGuildApplicationCommandsPermissionsJSONBody =
                [];

            for (let i = 0; i < res.length; i++) {
                const command = commands[i];
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

    static async createCommandIdMap(
        client: JellyCommands,
        paths: string | string[],
    ): Promise<CommandIDMap> {
        const { guildCommands, globalCommands, commands } =
            await CommandManager.readCommands(paths, client);

        // If cache is enabled, check it
        if (client.joptions.cache) {
            client.debug('Loading Cache');

            const idResolver = new CommandIdResolver();
            const cache = new CommandCache();

            if (cache.validate(commands)) {
                client.debug('Cache is valid');

                // Attempt to resolve command map
                const commandIdMap = idResolver.get(commands);

                // Only return a new command manager if id resolution was a success
                if (commandIdMap) {
                    client.debug('Id resolution success');
                    return commandIdMap;
                }

                // This will only run if a CommandManager isn't returned above
                client.debug('Id Resolver failed, reregistering commands');
            } else client.debug('Cache is invalid, registering commands');
        }

        // Register the commands against discord api
        const commandIdMap = await CommandManager.registerCommands(
            client,
            globalCommands,
            guildCommands,
        );

        // Update command cache and idResovler
        if (client.joptions.cache) {
            const idResolver = new CommandIdResolver();
            const cache = new CommandCache();

            client.debug('Cache has been updated');
            cache.set(commands);

            client.debug('Id Map has been updated');
            idResolver.set(commandIdMap);
        }

        return commandIdMap;
    }
}
