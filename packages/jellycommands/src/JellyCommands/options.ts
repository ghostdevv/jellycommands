import type { MessageOptions, ClientOptions } from 'discord.js';
import { pathsSchema, snowflakeArray } from '../util/joi';
import { MessagePayload } from 'discord.js';
import Joi from 'joi';

export const schema = Joi.object({
    commands: pathsSchema(),
    events: pathsSchema(),

    clientOptions: Joi.object().required(),

    props: Joi.object().default({}),

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

    dev: Joi.object({
        guilds: snowflakeArray(),
    }).default(),

    cache: Joi.bool().default(true),

    debug: Joi.bool().default(false),
});

export interface JellyCommandsOptions {
    /**
     * Array or single file/directory of command(s)
     */
    commands?: string | string[];

    /**
     * Array or single file/directory of events(s)
     */
    events?: string | string[];

    /**
     * Base discord.js client options
     */
    clientOptions: ClientOptions;

    /**
     * Inital props to pass to props api
     */
    props?: Record<string, any>;

    /**
     * Customisable responses
     */
    messages?: {
        /**
         * This is sent when a unknown command is given
         */
        unknownCommand?: string | MessagePayload | MessageOptions;
    };

    /**
     * Developer mode options
     */
    dev?: {
        /**
         * The guilds to run dev mode commands in
         */
        guilds?: string[];
    };

    cache?: boolean;

    /**
     * Whether jelly should emit debug messages
     */
    debug?: boolean;
}
