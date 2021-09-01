import type { MessageOptions, ClientOptions } from 'discord.js';
import { MessagePayload } from 'discord.js';
import Joi from 'joi';

const pathsSchema = () => [Joi.string(), Joi.array().items(Joi.string())];

export const schema = Joi.object({
    commands: pathsSchema(),

    clientOptions: Joi.object().required(),

    messages: Joi.object({
        unknownCommand: [
            Joi.string(),
            Joi.object().instance(MessagePayload),
            Joi.object(),
        ],
    }).default(),
});

export interface JellyCommandsOptions {
    /**
     * Array or single file/directory of command(s)
     */
    commands?: string | string[];

    /**
     * Base discord.js client options
     */
    clientOptions: ClientOptions;

    /**
     * Customisable responses
     */
    messages?: {
        /**
         * This is sent when a unknown command is given
         */
        unknownCommand?: string | MessagePayload | MessageOptions;
    };
}
