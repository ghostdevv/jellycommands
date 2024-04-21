import { JellyCommands } from '../JellyCommands';
import { read } from '../utils/files';
import { Event } from './Event';

export const registerEvents = async (
    client: JellyCommands,
    items: string | Array<string | Event<any>>,
) => {
    const events = new Set<Event<any>>();

    await read(items, (event) => {
        if (!(event instanceof Event))
            throw new Error(`Found invalid item "${event}" in options.events`);

        // Don't load disabled events
        if (!event.options.disabled) {
            events.add(event);
        }
    });

    for (const event of events) {
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
