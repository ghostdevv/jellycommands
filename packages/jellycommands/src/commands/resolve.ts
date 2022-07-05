import { GuildCommands, GlobalCommands } from './types.d';
import { resolveItems } from '../utils/resolveItems';
import { BaseCommand } from './types/BaseCommand';
import { JellyCommands } from '../JellyCommands';

export const resolveCommands = async (
    client: JellyCommands,
    items: string | Array<string | BaseCommand>,
) => {
    const commands = await resolveItems(items);

    const globalCommands: GlobalCommands = new Set();
    const guildCommands: GuildCommands = new Map();

    for (const command of commands) {
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
