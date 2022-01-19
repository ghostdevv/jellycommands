import type { CommandIDMap, CommandMap } from './CommandManager';
import { Cache } from '../structures/Cache';
import { deepEqual } from 'assert';

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

        try {
            deepEqual(cacheData.ids, this.commandHashIds(commands));
            return true;
        } catch (e) {
            return false;
        }
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
