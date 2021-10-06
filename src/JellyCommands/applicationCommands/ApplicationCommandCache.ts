import { readFileSync, writeFileSync, existsSync, mkdirSync, write } from 'fs';
import type { BaseCommand, BaseOptions } from './BaseCommand';
import { fileURLToPath } from 'url';
import { deepEqual } from 'assert';
import { join } from 'path';

const cachePath = join(fileURLToPath(import.meta.url), '../../.jellycommands');
if (!existsSync(cachePath)) mkdirSync(cachePath);

const cacheFile = join(cachePath, 'applicationCommandCache.json');
if (!existsSync(cacheFile)) writeFileSync(cacheFile, '{}', 'utf-8');

interface Command {
    name: string;
    id?: string;
    options: BaseOptions;
}

interface GuildCommandGroup {
    guildId: string;
    commands: Command[];
}

interface CommandPair {
    guildCommands: GuildCommandGroup[];
    globalCommands: Command[];
}

interface RuntimeCommandPair {
    guildCommands: Map<string, BaseCommand<BaseOptions>[]>;
    globalCommands: Set<BaseCommand<BaseOptions>>;
}

export class ApplicationCommandCache {
    constructor() {}

    set(runtimeCommandPair: RuntimeCommandPair) {
        const commandPair = this.toCommandPair(runtimeCommandPair);
        const json = JSON.stringify(commandPair, null, 4);

        writeFileSync(cacheFile, json, 'utf-8');
    }

    get(ids = true): CommandPair | null {
        const json = readFileSync(cacheFile, 'utf-8');

        try {
            const obj: CommandPair = JSON.parse(json);
            if (!obj?.globalCommands || !obj?.guildCommands) return null;

            if (!ids) {
                // Guild Commands
                for (const item of obj.guildCommands)
                    item.commands.forEach((c) => (c.id = undefined));

                for (const command of obj.globalCommands)
                    command.id = undefined;
            }

            return obj;
        } catch {
            return null;
        }
    }

    /**
     * This function checks if the cache is valid or not
     */
    validate(commands: RuntimeCommandPair) {
        const commandPair = this.toCommandPair(commands, false);
        const cachedCommandPair = this.get(false);

        if (!cachedCommandPair) return false;

        try {
            deepEqual(commandPair, cachedCommandPair);
            return true;
        } catch {
            return false;
        }
    }

    toCommandPair(
        { guildCommands, globalCommands }: RuntimeCommandPair,
        ids = true,
    ): CommandPair {
        const guildCommandGroup: GuildCommandGroup[] = [];

        for (const [guildId, commands] of guildCommands)
            guildCommandGroup.push({
                guildId,
                commands: commands.map((c) => c.toCachable(ids)),
            });

        const globalCommandsArray: Command[] = [];

        for (const command of globalCommands)
            globalCommandsArray.push(command.toCachable(ids));

        return {
            guildCommands: guildCommandGroup,
            globalCommands: globalCommandsArray,
        };
    }
}
