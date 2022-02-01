import type { ClientEvents } from 'discord.js';

export interface EventOptions<Event extends keyof ClientEvents> {
    /**
     * The event name: https://discord.js.org/#/docs/main/stable/class/Client
     */
    name: Event;

    /**
     * Whether or not the event should be loaded
     */
    disabled?: boolean;

    /**
     * Should the event be ran once or every time it's received
     */
    once?: boolean;
}

import Joi from 'joi';

export const schema = Joi.object({
    name: Joi.string().required(),
    disabled: Joi.bool().default(false),
    once: Joi.bool().default(false),
});
