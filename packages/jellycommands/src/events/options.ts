import type { EventName } from './Event';

export interface EventOptions<Event extends EventName> {
    /**
     * The event name: https://discord.js.org/#/docs/main/stable/class/Client
     */
    name: Event;

    /**
     * Whether or not the event should be loaded
     * @default false
     */
    disabled?: boolean;

    /**
     * Should the event be ran once or every time it's received
     * @default false
     */
    once?: boolean;
}

import { z } from 'zod';

export const eventSchema = z.object({
    name: z.string() as z.ZodType<EventName>,
    disabled: z.boolean().default(false),
    once: z.boolean().default(false),
});
