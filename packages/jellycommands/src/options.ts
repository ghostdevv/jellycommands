import type { ClientOptions, InteractionReplyOptions, MessagePayload } from 'discord.js';
import { LoadableComponents } from './components/loader';
import { isComponent } from './components/components';
import { snowflakeSchema } from './utils/snowflake';
// import { AnyPlugin } from './plugins/plugins';
import { z } from 'zod';

export const jellyCommandsOptionsSchema = z.object({
    components: z
        .union([
            z.string(),
            z.array(
                z.union([
                    z.string(),
                    z
                        .any()
                        .refine(
                            (component) => isComponent(component),
                            'Should be a component instance',
                        ),
                ]),
            ),
        ])
        .optional(),
    clientOptions: z.object({}).passthrough(),
    props: z.object({}).passthrough().default({}),
    // plugins: z.array(z.object({}).passthrough()).optional(),
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
    fs: z
        .object({
            extensions: z.string().array().default(['.js', '.ts']),
        })
        .default({}),
});

export interface JellyCommandsOptions {
    /**
     * The components of your bot. For any strings that are passed they
     * will be loaded recursively from that path.
     *
     * @see https://jellycommands.dev/guide/components
     */
    components?: LoadableComponents;

    /**
     * Base discord.js client options
     */
    clientOptions: ClientOptions;

    // /**
    //  * JellyCommands plugins
    //  * @see todo
    //  */
    // plugins?: AnyPlugin[];

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

    /**
     * Options to control how JellyCommands reads from the
     * filesystem when loading components.
     */
    fs?: {
        /**
         * Only files that end in these extensions are loaded.
         * @default ['.js', '.ts']
         */
        extensions?: string[];
    };
}
