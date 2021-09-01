import type { MessageOptions, ClientOptions } from 'discord.js';
import { MessagePayload } from 'discord.js';
import Joi from 'joi';

const pathsSchema = () => [Joi.string(), Joi.array().items(Joi.string())];

export const schema = Joi.object({
    /**
     * Array or single file/directory of command(s)
     */
    commands: pathsSchema(),

    /**
     * Base discord.js client options
     */
    clientOptions: Joi.object().required(),

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
    commands?: string | string[];

    clientOptions: ClientOptions;

    messages?: {
        unknownCommand?: string | MessagePayload | MessageOptions;
    };
}
