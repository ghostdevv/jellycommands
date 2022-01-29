import type { CommandIDMap, CommandMap } from './CommandManager';
import { Cache } from '../structures/Cache';

export interface CommandCacheData {
    ids: string[];
}

export class CommandCache {
    private cache = new Cache('command-cache');

    set(commands: CommandMap) {
        this.cache.set<CommandCacheData>({
            ids: this.commandHashIds(commands),
        });
    }

    commandHashIds(commands: CommandMap) {
        return Array.from(commands.keys());
    }

    validate(commands: CommandMap): boolean {
        const cacheData = this.cache.get<CommandCacheData>();
        if (!cacheData) return false;

        const newIds = this.commandHashIds(commands);
        const { ids } = cacheData;

        // If ids are invalid then nope out
        if (!ids || !Array.isArray(ids)) return false;

        // If the lengths aren't the same then they can't possibly be equal
        if (newIds.length != ids.length) return false;

        // If a id in newIds doesn't exist in the cache then exit
        for (const id of newIds) if (!ids.includes(id)) return false;

        return true;
    }
}

export type CommandIdResolverData = Record<string, string>;

export class CommandIdResolver {
    private cache = new Cache('command-id-resolver');

    set(commands: CommandIDMap) {
        const data: CommandIdResolverData = {};

        for (const [commandId, command] of commands)
            data[command.hashId] = commandId;

        this.cache.set<CommandIdResolverData>(data);
    }

    get(commands: CommandMap): CommandIDMap | false {
        const ids = this.cache.get<CommandIdResolverData>();
        const commandIdMap: CommandIDMap = new Map();

        if (!ids) return false;

        for (const command of commands.values()) {
            const commandId = ids[command.hashId];
            if (!commandId) return false;

            commandIdMap.set(commandId, command);
        }

        return commandIdMap;
    }
}
