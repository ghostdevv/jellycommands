import { Cache } from '../structures/Cache';
import { deepEqual } from 'assert';

import type {
    CacheableCommand,
    RuntimeCommandPair,
    CommandPair,
    GuildCommandGroup,
} from '../../types/commandCache.d';

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
