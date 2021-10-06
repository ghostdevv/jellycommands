import { readFileSync, writeFileSync, existsSync, mkdirSync, write } from 'fs';
import type { BaseCommand } from './base/BaseCommand';
import type { BaseOptions } from './base/options';
import { fileURLToPath } from 'url';
import { deepEqual } from 'assert';
import { join } from 'path';

const cachePath = join(fileURLToPath(import.meta.url), '../../.jellycommands');
if (!existsSync(cachePath)) mkdirSync(cachePath);

const cacheFile = join(cachePath, 'commandCache.json');
if (!existsSync(cacheFile)) writeFileSync(cacheFile, '{}', 'utf-8');

export interface CacheableCommand {
    options: BaseOptions;
    filePath: string;
}

export interface GuildCommandGroup {
    guildId: string;
    commands: CacheableCommand[];
}

export interface CommandPair {
    guildCommands: GuildCommandGroup[];
    globalCommands: CacheableCommand[];
}

export interface RuntimeCommandPair {
    guildCommands: Map<string, BaseCommand<BaseOptions>[]>;
    globalCommands: Set<BaseCommand<BaseOptions>>;
}

export class CommandCache {
    constructor() {}

    set(runtimeCommandPair: RuntimeCommandPair) {
        const commandPair = this.toCommandPair(runtimeCommandPair);
        const json = JSON.stringify(commandPair, null, 4);

        writeFileSync(cacheFile, json, 'utf-8');
    }

    get(): CommandPair | null {
        const json = readFileSync(cacheFile, 'utf-8');

        try {
            const obj: CommandPair = JSON.parse(json);
            if (!obj?.globalCommands || !obj?.guildCommands) return null;

            return obj;
        } catch {
            return null;
        }
    }

    /**
     * This function checks if the cache is valid or not
     */
    validate(commands: RuntimeCommandPair) {
        const commandPair = this.toCommandPair(commands);
        const cachedCommandPair = this.get();

        if (!cachedCommandPair) return false;

        try {
            deepEqual(commandPair, cachedCommandPair);
            return true;
        } catch {
            return false;
        }
    }

    toCommandPair({
        guildCommands,
        globalCommands,
    }: RuntimeCommandPair): CommandPair {
        const guildCommandGroup: GuildCommandGroup[] = [];

        for (const [guildId, commands] of guildCommands)
            guildCommandGroup.push({
                guildId,
                commands: commands.map((c) => c.toCachable()),
            });

        const globalCommandsArray: CacheableCommand[] = [];

        for (const command of globalCommands)
            globalCommandsArray.push(command.toCachable());

        return {
            guildCommands: guildCommandGroup,
            globalCommands: globalCommandsArray,
        };
    }
}
