import { JellyCommands } from '../JellyCommands';
import { read } from '../utils/files';
import { Event } from './Event';

export const registerEvents = async (
    client: JellyCommands,
    items: string | Array<string | Event<any>>,
) => {
    const events = new Set<Event>();

    await read(items, (event) => {
        if (!(event instanceof Event))
            throw new Error(`Found invalid item "${event}" in options.events`);

        events.add(event);
    });

    for (const event of events) {
        if (event.options.disabled) continue;

        const cb = async (...ctx: any[]) => {
            try {
                await event.run({ client, props: client.props }, ...ctx);
            } catch (error) {
                console.error(`There was an error running event ${event.name}`, error);
            }
        };

        // Register Event
        event.options.once ? client.once(event.name, cb) : client.on(event.name, cb);
    }
};
