export const defaults = {
    /**
     * Whether or not the command should be loaded
     */
    disabled: false,

    /**
     * Should the command work in dms
     */
    allowDM: false,
};

import Joi from 'joi';

export const schema = Joi.object({
    disabled: Joi.bool().required(),
    allowDM: Joi.bool().required(),
});
