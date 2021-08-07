export interface CommandOptions {
    /**
     * Whether or not the command should be loaded
     */
    disabled: boolean;

    /**
     * Should the command work in dms
     */
    allowDM: boolean;
}

import Joi from 'joi';

export const schema = Joi.object({
    disabled: Joi.bool().default(false),
    allowDM: Joi.bool().default(false),
});
