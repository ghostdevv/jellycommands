export const defaults = {
    /**
     * Whether or not the event should be loaded
     */
    disabled: false,

    /**
     * Should the event be ran once or every time it's recieved
     */
    once: false,
};

import Joi from 'joi';

export const schema = Joi.object({
    disabled: Joi.bool().required(),
    once: Joi.bool().required(),
});
