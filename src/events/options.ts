import type { ClientEvents } from 'discord.js';

export const defaults = {
    // The name of the event
    name: '' as keyof ClientEvents,

    // Whether or not the event should be loaded
    disabled: false,

    // Should the event be ran once or every time it's recieved
    once: false,
};

import Joi from 'joi';

export const schema = Joi.object({
    name: Joi.string().required(),
    disabled: Joi.bool().required(),
    once: Joi.bool().required(),
    run: Joi.func().required(),
});
