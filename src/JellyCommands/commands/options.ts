export interface CommandOptions {
    /**
     * Whether or not the command should be loaded
     */
    disabled?: boolean;

    /**
     * Should the command work in dms
     */
    allowDM?: boolean;

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

        /**
         * Only users who have a role that is in this array can use the command
         */
        allowedRoles?: string[];

        /**
         * If a user has a role that is in this array they won't be able to use the command
         */
        blockedRoles?: string[];
    };
}

import Joi from 'joi';

const snowflakeSchema = () => Joi.array().items(Joi.string().length(18));

export const schema = Joi.object({
    disabled: Joi.bool().default(false),
    allowDM: Joi.bool().default(false),

    guards: Joi.object({
        allowedUsers: snowflakeSchema(),
        blockedUsers: snowflakeSchema(),

        allowedRoles: snowflakeSchema(),
        blockedRoles: snowflakeSchema(),
    }).default(),
});
