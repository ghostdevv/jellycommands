import type {
    InteractionDeferReplyOptions,
    ApplicationCommandOptionData,
} from 'discord.js';

export interface CommandOptions {
    /**
     * The description of the slash command
     */
    description: string;

    /**
     * Options for the slash command
     */
    options?: ApplicationCommandOptionData[];

    /**
     * Should the interaction be defered?
     */
    defer?: boolean | InteractionDeferReplyOptions;

    /**
     * Whether the command is enabled by default when the app is added to a guild
     */
    defaultPermission?: boolean;

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

import Joi from 'joi';

const snowflakeSchema = () => Joi.array().items(Joi.string().length(18));

export const schema = Joi.object({
    description: Joi.string().required(),

    options: Joi.array(),

    defer: [
        Joi.bool(),
        Joi.object({
            ephemeral: Joi.bool(),
            fetchReply: Joi.bool(),
        }),
    ],

    defaultPermission: Joi.bool(),

    guilds: snowflakeSchema(),

    global: Joi.bool().default(false),

    disabled: Joi.bool().default(false),
});
