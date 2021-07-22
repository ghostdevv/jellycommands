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
     * Customisable responses
     */
    messages: {
        /**
         * This is sent when a unkown command is given
         */
        unkownCommand: {
            reply: false,
            message: {
                description: 'Unkown Command',
                color: '#A8A7A7',
            },
        } as Required<JellyCommandsOptionsMessage>,
    },
};

export type FullJellyCommandsOptions = typeof defaults;

export interface JellyCommandsOptionsMessage {
    reply?: boolean;
    message: string | MessageEmbed | MessageEmbedOptions;
}

export interface JellyCommandsOptions {
    ignoreBots?: boolean;
    prefix?: string;

    messages?: {
        unkownCommand?: JellyCommandsOptionsMessage;
    };
}

import Joi from 'joi';

const messageSchema = Joi.object({
    reply: Joi.bool().required(),
    message: Joi.alternatives().try(
        Joi.string(),
        Joi.object().instance(MessageEmbed),
        Joi.object(),
    ),
});

export const schema = Joi.object({
    ignoreBots: Joi.bool().required(),
    prefix: Joi.string().min(1).max(64).required(),

    messages: Joi.object({
        unkownCommand: messageSchema.required(),
    }).required(),
});
