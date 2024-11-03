import type { ClientOptions, InteractionReplyOptions, MessagePayload } from 'discord.js';
import { LoadableFeatures } from './features/loader';
import { snowflakeSchema } from './utils/snowflake';
import { isFeature } from './features/features';
import { z } from 'zod';

export const jellyCommandsOptionsSchema = z.object({
    features: z
        .union([
            z.string(),
            z.array(
                z.union([
                    z.string(),
                    z.any().refine((feature) => isFeature(feature), 'Should be a feature instance'),
                ]),
            ),
        ])
        .optional(),
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
    debug: z.boolean().default(() => !!process.env['DEBUG']),
});

export interface JellyCommandsOptions {
    /**
     * The features of your bot. For any strings that are passed they
     * will be loaded recursively from that path.
     * @see todo
     */
    features: LoadableFeatures;

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
