import { resolveItems } from '../utils/resolveItems';
import { JellyCommands } from '../JellyCommands';
import { Event } from './Event';

export const registerEvents = async (
    client: JellyCommands,
    items: string | Array<string | Event<any>>,
) => {
    const events = await resolveItems(items);

    for (const event of events) {
        if (event.options.disabled) continue;

        const cb = async (...ctx: any[]) => {
            try {
                await event.run({ client }, ...ctx);
            } catch (error) {
                console.error(`There was an error running event ${event.name}`, error);
            }
        };

        // Register Event
        event.options.once ? client.once(event.name, cb) : client.on(event.name, cb);
    }
};
