import { defineFeaturePlugin } from '../plugins/plugins';
import type { Event } from './Event';

export const EVENTS_FEATURE_ID = 'jellycommands.event';

export const eventsPlugin = defineFeaturePlugin<Event>(EVENTS_FEATURE_ID, {
    register(client, events) {
        for (const event of events) {
            async function cb(...ctx: any[]) {
                try {
                    await event.run({ client, props: client.props }, ...ctx);
                } catch (error) {
                    console.error(`There was an error running event ${event.name}`, error);
                }
            }

            event.options.once ? client.once(event.name, cb) : client.on(event.name, cb);
        }
    },
});
