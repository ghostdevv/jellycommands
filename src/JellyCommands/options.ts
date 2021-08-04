import type { MessagePayload, MessageOptions } from 'discord.js';
import { MessageEmbed } from 'discord.js';

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
            embeds: [
                {
                    description: 'Unkown Command',
                    color: 'RANDOM',
                },
            ],
        } as JellyCommandsOptionsMessage,
    },
};

export type FullJellyCommandsOptions = typeof defaults;

export type JellyCommandsOptionsMessage =
    | string
    | MessagePayload
    | MessageOptions;

export interface JellyCommandsOptions {
    ignoreBots?: boolean;
    prefix?: string;

    messages?: {
        unkownCommand?: JellyCommandsOptionsMessage;
    };
}

import Joi from 'joi';

const messageSchema = Joi.alternatives().try(Joi.string(), Joi.object());

export const schema = Joi.object({
    ignoreBots: Joi.bool().required(),
    prefix: Joi.string().min(1).max(64).required(),

    messages: Joi.object({
        unkownCommand: messageSchema.required(),
    }).required(),
});
