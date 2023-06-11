import type { BaseFeatureOptions } from '../../features/features';
import type { InteractionDeferReplyOptions } from 'discord.js';
import type { PermissionResolvable } from 'discord.js';
import type { Locale } from 'discord-api-types/v10';
import { snowflakeArray } from '../../utils/joi';
import Joi from 'joi';

export interface BaseOptions extends BaseFeatureOptions {
    /**
     * The name of the command
     */
    name: string;

    /**
     * Localize a command name to different languages
     */
    nameLocalizations?: Partial<Record<Locale, string>>;

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
         * The permissions a member must have to run this command
         */
        permissions?: PermissionResolvable;
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
     * Should the slash command work in dms, this only works on global commands
     * @default true
     */
    dm?: boolean;

    /**
     * Whether or not the slash command should be loaded
     */
    disabled?: boolean;
}

export const baseSchema = Joi.object({
    name: Joi.string().required(),
    nameLocalizations: Joi.object(),

    dev: Joi.bool().default(false),

    defer: [
        Joi.bool(),
        Joi.object({
            ephemeral: Joi.bool(),
            fetchReply: Joi.bool(),
        }),
    ],

    guards: Joi.object({
        permissions: Joi.any(),
    }),

    guilds: snowflakeArray(),
    global: Joi.bool().default(false),
    dm: Joi.bool().default(true),
    disabled: Joi.bool().default(false),
});
