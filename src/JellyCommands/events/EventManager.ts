import type { JellyCommands } from '../JellyCommands';
import { flattenPaths } from 'ghoststools';
import { readJSFile } from '../../util/fs';
import type { Event } from './Event';

export class EventManager {
    static async loadEvents(client: JellyCommands, paths: string | string[]) {
        for (const file of flattenPaths(paths)) {
            const event = await readJSFile<Event>(file);
            if (event.options.disabled) continue;

            const cb = (...ctx: any[]) => event.run(...ctx, { client });

            if (event.options.once) client.once(event.name, cb);
            else client.on(event.name, cb);
        }
    }
}
