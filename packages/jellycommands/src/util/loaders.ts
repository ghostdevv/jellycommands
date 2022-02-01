import type { BaseCommand } from '../JellyCommands/commands/base/BaseCommand.js';
import type { Event } from '../JellyCommands/events/Event.js';
import { readFiles, readJSFile } from './fs.js';

const loadFiles = async <T>(path: string) => {
    const files = readFiles(path);
    const items: T[] = [];

    for (const file of files) {
        const item = await readJSFile<T>(file);
        items.push(item);
    }

    return items;
};

export async function loadCommands(
    commandsOrPaths: string | Array<string | BaseCommand>,
): Promise<BaseCommand[]> {
    const commands: BaseCommand[] = [];

    if (typeof commandsOrPaths === 'string') {
        const resolved = await loadFiles<BaseCommand>(commandsOrPaths);
        commands.push(...resolved);
        return commands;
    }

    for (const item of commandsOrPaths) {
        if (typeof item == 'string') {
            const resolved = await loadFiles<BaseCommand>(item);
            commands.push(...resolved);
        } else {
            commands.push(item as BaseCommand);
        }
    }

    return commands;
}

type UnknownEvent = InstanceType<typeof Event>;

export async function loadEvents(
    eventsOrPaths: string | Array<string | UnknownEvent>,
): Promise<UnknownEvent[]> {
    const events: UnknownEvent[] = [];

    if (typeof eventsOrPaths === 'string') {
        const resolved = await loadFiles<UnknownEvent>(eventsOrPaths);
        events.push(...resolved);
        return events;
    }

    for (const item of eventsOrPaths) {
        if (typeof item === 'string') {
            const resolved = await loadFiles<UnknownEvent>(item);
            events.push(...resolved);
        } else {
            events.push(item as UnknownEvent);
        }
    }

    return events;
}
