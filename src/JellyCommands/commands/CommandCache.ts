import type { BaseCommand } from './base/BaseCommand';
import type { BaseOptions } from './base/options';
import { Cache } from '../../util/Cache';
import { deepEqual } from 'assert';

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
    guildCommands: Map<string, Set<BaseCommand<BaseOptions>>>;
    globalCommands: Set<BaseCommand<BaseOptions>>;
}

export class CommandCache {
    private readonly commandCache = new Cache('commandCache');

    constructor() {}

    set(runtimeCommandPair: RuntimeCommandPair) {
        const commandPair = this.toCommandPair(runtimeCommandPair);
        this.commandCache.set(commandPair);
    }

    get(): CommandPair | null {
        const data = this.commandCache.get<CommandPair>();

        if (!data) return null;
        if (!data?.globalCommands || !data?.guildCommands) return null;

        return data;
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
                commands: [...commands].map((c) => c.toCachable()),
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
