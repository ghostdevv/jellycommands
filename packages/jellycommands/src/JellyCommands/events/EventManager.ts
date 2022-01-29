import type { JellyCommands } from '../JellyCommands';
import { UserProvidedEvent } from '../../util/loaders.js';

export class EventManager {
    static async loadEvents(
        client: JellyCommands,
        _events: UserProvidedEvent[],
    ) {
        for (const event of _events) {
            if (event.options.disabled) continue;

            const cb = (...ctx: any[]) => event.run({ client }, ...ctx);

            if (event.options.once) client.once(event.name, cb);
            else client.on(event.name, cb);
        }
    }
}
