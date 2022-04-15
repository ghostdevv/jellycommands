import type { JellyCommands } from '../JellyCommands';
import type { ClientEvents } from 'discord.js';
import type { Event } from './Event';

export class EventManager {
    static async loadEvents(
        client: JellyCommands,
        events: InstanceType<typeof Event>[],
    ) {
        for (const event of events) {
            if (event.options.disabled) continue;

            const cb = async <EventName extends keyof ClientEvents>(
                ...ctx: ClientEvents[EventName]
            ) => {
                try {
                    await event.run({ client }, ...ctx);
                } catch (e) {
                    console.error(
                        `There was an error running event ${event.name}`,
                        e,
                    );
                }
            };

            if (event.options.once) client.once(event.name, cb);
            else client.on(event.name, cb);
        }
    }
}
