import type { InteractionDeferReplyOptions } from 'discord.js';
import { snowflakeArray } from '../../../util/joi';
import Joi from 'joi';

export interface BaseOptions {
    /**
     * The name of the command
     */
    name: string;

    /**
     * Is the command in dev mode or not
     */
    dev?: boolean;

    /**
     * Should the interaction be defered?
     */
    defer?: boolean | InteractionDeferReplyOptions;

    /**
     * Guards allow you to prevent/allow certain people/groups to your command
     */
    guards?: {
        /**
         * Should the guards act as a whitelist or blacklist
         */
        mode: 'whitelist' | 'blacklist';

        /**
         * Which users should be allowed only (whitelist) or should be blocked (blacklist)
         */
        users?: string[];

        /**
         * Which roles should be allowed only (whitelist) or should be blocked (blacklist)
         */
        roles?: string[];
    };

    /**
     * The guilds to apply the slash command in
     */
    guilds?: string[];

    /**
     * Should the slash command be global across all guilds
     */
    global?: boolean;

    /**
     * Whether or not the slash command should be loaded
     */
    disabled?: boolean;
}

export const baseSchema = Joi.object({
    name: Joi.string().required(),

    dev: Joi.bool().default(false),

    defer: [
        Joi.bool(),
        Joi.object({
            ephemeral: Joi.bool(),
            fetchReply: Joi.bool(),
        }),
    ],

    guards: Joi.object({
        mode: Joi.string().valid('whitelist', 'blacklist').required(),
        users: snowflakeArray(),
        roles: snowflakeArray(),
    }),

    guilds: snowflakeArray(),
    global: Joi.bool().default(false),
    disabled: Joi.bool().default(false),
});
