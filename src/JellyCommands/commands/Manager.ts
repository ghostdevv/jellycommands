import { createRequest } from '../../util/request';
import { Routes } from 'discord-api-types/v9';
import { flattenPaths } from 'ghoststools';
import { readJSFile } from '../../util/fs';

import type { JellyCommands } from '../JellyCommands';
import type { CommandInteraction } from 'discord.js';
import type { Command } from './Command';

export class CommandManager {
    private client;
    private commands: Map<string, Command>;

    constructor(client: JellyCommands, commands: CommandManager['commands']) {
        this.client = client;
        this.commands = commands;
    }

    public async respond(interaction: CommandInteraction) {
        const command = this.commands.get(interaction.commandId);

        /**
         * If command is not found return - if unknownCommand message send
         */
        if (!command)
            return (
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
        const clientId = client.resolveClientId();
        const token = client.resolveToken();

        if (!token) throw new Error('No token found');
        if (!clientId) throw new Error('No client id found');

        const commands = await CommandManager.registerCommands(
            paths,
            token,
            clientId,
        );

        return new CommandManager(client, commands);
    }

    static async registerCommands(
        paths: string | string[],
        token: string,
        clientId: string,
    ) {
        const commands = new Map<string, Command>();
        const request = createRequest(token);

        for (const file of flattenPaths(paths)) {
            const command = await readJSFile<Command>(file);
            if (command.options.disabled) continue;

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
             * For every guild in the guild array, register as a guild command
             */
            for (const guild of command.options.guilds || []) {
                const res = await request<{ id: string }>(
                    'post',
                    Routes.applicationGuildCommands(clientId, guild),
                    command.applicationCommandData,
                );

                commands.set(res.id, command);
            }

            /**
             * For every registered command, and every guild in that command's guild array set permissions
             */
            for (const [commandID, command] of commands) {
                if (!command.options.guards || !command.options.guilds)
                    continue;

                for (const guild of command.options.guilds)
                    await request(
                        'put',
                        Routes.applicationCommandPermissions(
                            clientId,
                            guild,
                            commandID,
                        ),
                        { permissions: command.applicationCommandPermissions },
                    );
            }
        }

        return commands;
    }
}
