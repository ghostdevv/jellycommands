import type { MessageOptions } from 'discord.js';
import { MessagePayload } from 'discord.js';
import Joi from 'joi';

export const schema = Joi.object({
    /**
     * Customisable responses
     */
    messages: Joi.object({
        /**
         * This is sent when a unknown command is given
         */
        unknownCommand: [
            Joi.string(),
            Joi.object().instance(MessagePayload),
            Joi.object(),
        ],
    }).default(),
});

export interface JellyCommandsOptions {
    messages?: {
        unknownCommand?: string | MessagePayload | MessageOptions;
    };
}
