import type { ClientOptions, InteractionReplyOptions, MessagePayload } from 'discord.js';
import { BaseCommand } from './commands/types/BaseCommand.js';
import { snowflakeSchema } from './utils/zod.js';
import { Button } from './buttons/buttons';
import { Event } from './events/Event';
import { z } from 'zod';

export const jellyCommandsOptionsSchema = z.object({
    commands: z
        .union([z.string(), z.union([z.string(), z.instanceof(BaseCommand)]).array()])
        .optional(),
    events: z.union([z.string(), z.union([z.string(), z.instanceof(Event)]).array()]).optional(),
    buttons: z.union([z.string(), z.union([z.string(), z.instanceof(Button)]).array()]).optional(),
    clientOptions: z.object({}).passthrough(),
    props: z.object({}).passthrough().default({}),
    messages: z
        .object({
            unknownCommand: z.union([
                z.string(),
                z
                    .object({})
                    .passthrough()
                    .default({ embeds: [{ description: 'Unknown Command' }] }),
            ]),
        })
        .default({}),
    dev: z
        .object({
            global: z.boolean().default(false),
            guilds: snowflakeSchema.array().nonempty().optional(),
        })
        .default({}),
    cache: z.boolean().default(true),
    debug: z.boolean().default(false),
});

export interface JellyCommandsOptions {
    /**
     * Either an array of commands, or path(s) to commands
     */
    commands?: string | Array<string | BaseCommand>;

    /**
     * Either an array of events, or path(s) to events
     */
    events?: string | Array<string | Event>;

    /**
     * Either an array of buttons, or path(s) to buttons
     */
    buttons?: string | Array<string | Button>;

    /**
     * Base discord.js client options
     */
    clientOptions: ClientOptions;

    /**
     * Inital props
     */
    props?: Props;

    /**
     * Customisable responses
     */
    messages?: {
        /**
         * This is sent when a unknown command is given
         */
        unknownCommand?: string | MessagePayload | InteractionReplyOptions;
    };

    /**
     * Developer mode options
     */
    dev?: {
        /**
         * Should dev mode be enabled globally?
         */
        global?: boolean;

        /**
         * The guilds to run dev mode commands in
         */
        guilds?: string[];
    };

    /**
     * Should jelly cache commands - highly recommended
     * @default true
     */
    cache?: boolean;

    /**
     * Whether jelly should emit debug messages
     */
    debug?: boolean;
}
