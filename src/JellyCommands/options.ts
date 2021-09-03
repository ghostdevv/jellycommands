import type { MessageOptions, ClientOptions } from 'discord.js';
import { MessagePayload } from 'discord.js';
import { pathsSchema } from '../util/joi';
import Joi from 'joi';

export const schema = Joi.object({
    commands: pathsSchema(),

    clientOptions: Joi.object().required(),

    messages: Joi.object({
        unknownCommand: Joi.alternatives()
            .try(
                Joi.string(),
                Joi.object().instance(MessagePayload),
                Joi.object(),
            )
            .default({
                embeds: [{ description: 'Unknown Command' }],
            }),
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
