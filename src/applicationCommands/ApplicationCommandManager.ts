import { createRequest } from '../util/request';
import { Routes } from 'discord-api-types/v9';
import { BaseCommand } from './BaseCommand';
import { flattenPaths } from 'ghoststools';
import { readJSFile } from '../util/fs';

import type { JellyCommands } from '../JellyCommands/JellyCommands';
import type { ApplicationCommand } from '../types/applicationCommands';
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

    static async create(client: JellyCommands, paths: string | string[]) {
        const { clientId, token } = client.getAuthDetails();
        const request = createRequest(token);

        const commands = new Map<string, BaseCommand>();
        const seenGuilds = new Set<string>();

        for (const file of flattenPaths(paths)) {
            const command = await readJSFile<BaseCommand>(file);
            if (command.options?.disabled) continue;

            /**
             * If the command has global: true then register as global
             */
            if (command.options.global) {
                const res = await request<{ id: string }>(
                    'post',
                    Routes.applicationCommands(clientId),
                    command.applicationCommandData,
                );

                commands.set(res.id, command);
            }

            /**
             * If the command has a guilds array, and is not a global command, register in each guild
             */
            if (!command.options.global)
                for (const guild of command.options.guilds || []) {
                    const res = await request<{ id: string }>(
                        'post',
                        Routes.applicationGuildCommands(clientId, guild),
                        command.applicationCommandData,
                    );

                    commands.set(res.id, command);
                }

            /**
             * Update seen guilds
             */
            if (command.options.guilds)
                for (const guildId of command.options.guilds)
                    seenGuilds.add(guildId);
        }

        /**
         * For every registered command, and every guild in that command's guild array set permissions
         */
        for (const guildId of seenGuilds) {
            const permissions = [...commands.entries()]
                .filter(
                    ([, command]) =>
                        command.options?.guards &&
                        command.options?.guilds?.includes(guildId),
                )
                .map(([commandId, command]) => ({
                    id: commandId,
                    permissions: command.applicationCommandPermissions,
                }));

            await request(
                'put',
                Routes.guildApplicationCommandsPermissions(clientId, guildId),
                permissions,
            );
        }

        /**
         * Fetch global commands
         */
        const existingGlobal = await request<ApplicationCommand[]>(
            'get',
            Routes.applicationCommands(clientId),
        );

        /**
         * Delete old global commands
         */
        for (const { id } of existingGlobal) {
            if (!commands.has(id))
                await request(
                    'delete',
                    Routes.applicationCommand(clientId, id),
                );
        }

        for (const guildId of seenGuilds) {
            const existingCommands = await request<ApplicationCommand[]>(
                'get',
                Routes.applicationGuildCommands(clientId, guildId),
            );

            /**
             * Delete old guild commands
             */
            for (const { id } of existingCommands) {
                if (!commands.has(id))
                    await request(
                        'delete',
                        Routes.applicationGuildCommand(clientId, guildId, id),
                    );
            }
        }

        return new ApplicationCommandManager(client, commands);
    }
}
