import type { BaseCommand } from '../JellyCommands/commands/base/BaseCommand.js';
import type { Event } from '../JellyCommands/events/Event.js';
import { readFiles, readJSFile } from './fs.js';

const loadFilesToSet = async <T>(set: Set<T>, path: string) => {
    const files = readFiles(path);

    for (const file of files) {
        const item = await readJSFile<T>(file);
        set.add(item);
    }
};

export async function loadCommands(
    commandsOrPaths: string | Array<string | BaseCommand>,
): Promise<Set<BaseCommand>> {
    const commands = new Set<BaseCommand>();

    if (typeof commandsOrPaths === 'string') {
        await loadFilesToSet(commands, commandsOrPaths);
        return commands;
    }

    for (const item of commandsOrPaths) {
        if (typeof item == 'string') {
            await loadFilesToSet<BaseCommand>(commands, item);
        }

        commands.add(item as BaseCommand);
    }

    return commands;
}

type UnknownEvent = InstanceType<typeof Event>;

export async function loadEvents(
    eventsOrPaths: string | Array<string | UnknownEvent>,
): Promise<Set<UnknownEvent>> {
    const events = new Set<UnknownEvent>();

    if (typeof eventsOrPaths === 'string') {
        await loadFilesToSet<UnknownEvent>(events, eventsOrPaths);
        return events;
    }

    for (const item of eventsOrPaths) {
        if (typeof eventsOrPaths === 'string') {
            await loadFilesToSet<UnknownEvent>(events, eventsOrPaths);
        }

        events.add(item as UnknownEvent);
    }

    return events;
}
