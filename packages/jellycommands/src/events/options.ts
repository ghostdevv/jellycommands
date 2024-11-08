import type { BaseComponentOptions } from '../components/components';
import type { EventName } from './Event';

export interface EventOptions<Event extends EventName> extends BaseComponentOptions {
    /**
     * The event name: https://discord.js.org/#/docs/main/stable/class/Client
     */
    name: Event;

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
