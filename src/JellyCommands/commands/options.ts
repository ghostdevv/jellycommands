export interface CommandOptions {
    /**
     * Whether or not the command should be loaded
     */
    disabled: boolean;

    /**
     * Should the command work in dms
     */
    allowDM: boolean;

    /**
     * Guards allow you to only allow people who meet certain criteria use the command
     */
    guards?: {
        /**
         * Only allows users that have their id in the array to use command
         */
        allowedUsers?: string[];

        /**
         * If a user is in this array they won't be able to use the command
         */
        blockedUsers?: string[];
    };
}

import Joi from 'joi';

export const schema = Joi.object({
    disabled: Joi.bool().default(false),
    allowDM: Joi.bool().default(false),

    guards: Joi.object({
        allowedUsers: Joi.array().items(Joi.string().length(18)).optional(),
        blockedUsers: Joi.array().items(Joi.string().length(18)).optional(),
    }).default(),
});
