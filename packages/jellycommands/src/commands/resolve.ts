import { GuildCommands, GlobalCommands } from './types.d';
import { BaseCommand } from './types/BaseCommand';
import { JellyCommands } from '../JellyCommands';
import { AnyCommand } from './types/types';
import { read } from '../utils/files';

export const resolveCommands = async (
    client: JellyCommands,
    items: string | Array<string | AnyCommand>,
) => {
    const commands = new Set<AnyCommand>();

    await read(items, (command) => {
        if (!(command instanceof BaseCommand))
            throw new Error(`Found invalid item "${command}" in options.commands`);

        // Don't load disabled commands
        if (!command.options.disabled) {
            commands.add(command);
        }
    });

    const globalCommands: GlobalCommands = new Set();
    const guildCommands: GuildCommands = new Map();

    for (const command of commands) {
        if (command.options.disabled) {
            commands.delete(command);
            continue;
        }

        const devMode = client.joptions.dev?.global || command.options.dev;
        const devGuilds = client.joptions.dev?.guilds || [];

        if (devMode) {
            command.options.dev = true;
            command.options.global = false;
            command.options.guilds = devGuilds;
        }

        if (command.options.global) {
            globalCommands.add(command);
        }

        if (command.options.guilds) {
            for (const guildId of command.options.guilds) {
                const existing = guildCommands.get(guildId) || new Set();

                existing.add(command);
                guildCommands.set(guildId, existing);
            }
        }
    }

    return {
        guildCommands,
        globalCommands,
        commands,
    };
};
