import { createRequest } from '../util/request';
import { Routes } from 'discord-api-types/v9';
import { BaseCommand } from './BaseCommand';
import { flattenPaths } from 'ghoststools';
import { readJSFile } from '../util/fs';

import type { ApplicationCommandPermissions } from '../types/applicationCommands';
import type { ApplicationCommand } from '../types/applicationCommands';
import type { JellyCommands } from '../JellyCommands/JellyCommands';
import type { Interaction } from 'discord.js';

export class ApplicationCommandManager {
    private client;
    private commands;

    constructor(client: JellyCommands, commands: Map<string, BaseCommand>) {
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
        const guildCommands = new Map<string, BaseCommand[]>();
        const globalCommands = new Set<BaseCommand>();

        for (const file of flattenPaths(paths)) {
            const command = await readJSFile<BaseCommand>(file);
            if (command.options?.disabled) continue;

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
        }

        return {
            guildCommands,
            globalCommands,
        };
    }

    static async create(client: JellyCommands, paths: string | string[]) {
        const { clientId, token } = client.getAuthDetails();
        const request = createRequest(token);

        const { guildCommands, globalCommands } =
            await ApplicationCommandManager.getCommandFiles(paths);

        const commands = new Map<string, BaseCommand>();

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
        registeredGlobalCommands.forEach((c, i) =>
            commands.set(c.id, [...globalCommands][i]),
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
            res.forEach((c, i) => commands.set(c.id, gcommands[i]));
        }

        interface PermissionData {
            id: string;
            permissions: ApplicationCommandPermissions[];
        }

        /**
         * A permissions map of guildId to permission data
         */
        const permissions = new Map<string, PermissionData[]>();

        /**
         * Add all commands to the permissions Map
         */
        for (const [commandId, command] of commands) {
            if (command.applicationCommandPermissions)
                for (const guildId of command.options.guilds || [])
                    permissions.set(guildId, [
                        ...(permissions.get(guildId) || []),
                        {
                            id: commandId,
                            permissions: command.applicationCommandPermissions,
                        },
                    ]);
        }

        /**
         * Set the permissions
         */
        for (const [guildId, permissionData] of permissions)
            await request(
                'put',
                Routes.guildApplicationCommandsPermissions(clientId, guildId),
                permissionData,
            );

        return new ApplicationCommandManager(client, commands);
    }
}
