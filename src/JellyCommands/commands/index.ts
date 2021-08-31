import { Routes } from 'discord-api-types/v9';
import { flattenPaths } from 'ghoststools';
import { readJSFile } from '../../util/fs';
import { REST } from '@discordjs/rest';

import type { ApplicationCommand } from 'discord.js';
import type { Command } from './Command';

export async function loadCommands(
    paths: string | string[],
    token: string,
    clientID: string,
) {
    const files = flattenPaths(paths);

    const rest = new REST({ version: '9' }).setToken(token);

    for (const file of files) {
        const command = await readJSFile<Command>(file);
        if (command.options.disabled) continue;

        if (
            command.options.global &&
            !command.options.guilds?.length &&
            command.options.guards
        ) {
            throw new Error(
                'If using guards on a global command you must have a guilds array, guards can only be applied to guilds',
            );
        }

        const commands = new Map<string, Command>();

        interface response {
            id: string;
        }

        /**
         * If the command has global: true then register as global
         */
        if (command.options.global) {
            const res = (await rest.post(Routes.applicationCommands(clientID), {
                body: command.applicationCommandData,
            })) as response;

            commands.set(res.id, command);
        }

        /**
         * For every guild in the guild array, register as a guild command
         */
        for (const guild of command.options.guilds || []) {
            const res = (await rest.post(
                Routes.applicationGuildCommands(clientID, guild),
                {
                    body: command.applicationCommandData,
                },
            )) as response;

            commands.set(res.id, command);
        }

        /**
         * For every registered command, and every guild in that command's guild array set permissions
         */
        for (const [commandID, command] of commands) {
            if (!command.options.guards || !command.options.guilds) continue;

            for (const guild of command.options.guilds)
                await rest.put(
                    Routes.applicationCommandPermissions(
                        clientID,
                        guild,
                        commandID,
                    ),
                    {
                        body: {
                            permissions: command.applicationCommandPermissions,
                        },
                    },
                );
        }
    }
}
