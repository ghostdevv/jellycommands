import { MessageEmbed, MessageEmbedOptions } from 'discord.js';

export const defaults = {
    /**
     * Set to ignore messages from other discord bots or not.
     */
    ignoreBots: true,

    /**
     * Default prefix for the bot.
     */
    prefix: '!',

    /**
     * The base embed will be applied to all embeds so you don't have to customise it every time
     */
    baseEmbed: {
        color: 'RANDOM',
    } as MessageEmbed | MessageEmbedOptions,

    /**
     * Customisable responses
     */
    messages: {
        /**
         * This is sent when a unkown command is given
         */
        unkownCommand: {
            description: 'Unkown Command',
        } as Required<JellyCommandsOptionsMessage>,
    },
};

export type FullJellyCommandsOptions = typeof defaults;

export type JellyCommandsOptionsMessage =
    | string
    | MessageEmbed
    | MessageEmbedOptions;

export interface JellyCommandsOptions {
    ignoreBots?: boolean;
    prefix?: string;

    baseEmbed?: MessageEmbed | MessageEmbedOptions;

    messages?: {
        unkownCommand?: JellyCommandsOptionsMessage;
    };
}

import Joi from 'joi';

const messageSchema = Joi.alternatives().try(
    Joi.string(),
    Joi.object().instance(MessageEmbed),
    Joi.object(),
);

export const schema = Joi.object({
    ignoreBots: Joi.bool().required(),
    prefix: Joi.string().min(1).max(64).required(),

    baseEmbed: Joi.alternatives().try(
        Joi.object().instance(MessageEmbed),
        Joi.object(),
    ),

    messages: Joi.object({
        unkownCommand: messageSchema.required(),
    }).required(),
});
