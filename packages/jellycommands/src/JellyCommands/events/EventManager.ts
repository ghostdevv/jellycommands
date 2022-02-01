import type { JellyCommands } from '../JellyCommands';
import type { Event } from './Event';

export class EventManager {
    static async loadEvents(
        client: JellyCommands,
        events: InstanceType<typeof Event>[],
    ) {
        for (const event of events) {
            if (event.options.disabled) continue;

            const cb = (...ctx: any[]) => event.run({ client }, ...ctx);

            if (event.options.once) client.once(event.name, cb);
            else client.on(event.name, cb);
        }
    }
}
