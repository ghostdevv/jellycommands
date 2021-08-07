export interface EventOptions {
    /**
     * Whether or not the event should be loaded
     */
    disabled: boolean;

    /**
     * Should the event be ran once or every time it's recieved
     */
    once: boolean;
}

import Joi from 'joi';

export const schema = Joi.object({
    disabled: Joi.bool().default(false),
    once: Joi.bool().required().default(false),
});
