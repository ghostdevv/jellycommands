import { type ClientEvents, Events } from 'discord.js';

export interface EventOptions<Event extends keyof ClientEvents> {
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

export const schema = z.object({
    name: z
        .string()
        .refine((str): str is keyof ClientEvents => Object.values(Events).includes(str as any), {
            message: 'Event name must be a valid client event',
        }),
    disabled: z.boolean().default(false),
    once: z.boolean().default(false),
});
