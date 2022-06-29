import { GuildCommands, GlobalCommands } from './types.d';
import { resolveItems } from '../util/resolveItems';
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

        // TODO solve this issue
        if (command.options.guards) {
            throw new Error(
                'Discord made breaking changes to their API for permissions, whilst we work out how to deal with that we have disabled permissions feature to stop bots from breaking. Track progress here https://github.com/ghostdevv/jellycommands/issues/108',
            );
        }

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
