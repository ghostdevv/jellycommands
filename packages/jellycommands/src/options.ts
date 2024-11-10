import type {
	ClientOptions,
	InteractionReplyOptions,
	MessagePayload,
} from 'discord.js';
import type { LoadableComponents } from './components/loader';
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
	debug: z.boolean().default(() => !!process.env.DEBUG),
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
	 * @see https://jellycommands.dev/components
	 */
	components?: LoadableComponents;

	/**
	 * You can use this to pass options to the base Discord.js client.
	 * This will need to be used to set `intents` at a minimum.
	 *
	 * @see https://discord.js.org/docs/packages/discord.js/14.16.3/ClientOptions:Interface
	 */
	clientOptions: ClientOptions;

	// /**
	//  * JellyCommands plugins
	//  * @see todo
	//  */
	// plugins?: AnyPlugin[];

	/**
	 * Props are used to pass data around your client.
	 * @see https://jellycommands.dev/components/props/
	 */
	props?: Props;

	/**
	 * This allows you to control the default messages sent by JellyCommands
	 * when your code is unable to handle them. Currently only handles
	 * an unknownCommand state.
	 *
	 * @see https://jellycommands.dev/guides/messages/
	 */
	messages?: {
		/**
		 * This is sent when your bot recieves an unknown command. This only
		 * happens if your user sends a command just as you re-register them
		 * as we respond to commands based on id rather than name currently.
		 *
		 * @see https://jellycommands.dev/guides/messages#unknown-command
		 */
		unknownCommand?: string | MessagePayload | InteractionReplyOptions;
	};

	/**
	 * Developer mode makes it easier to iterate on your commands
	 * by registering them locally to a guild rather than locally.
	 * Discord checks for fresh guild commands every time, while global
	 * commands are only checked periodically. You should enable this
	 * when developing, and disable this in production.
	 *
	 * @see https://jellycommands.dev/components/commands/dev
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
	 * Controls whether commands should be cached. This allows for restarting
	 * your Discord Bot repeatedly without having to re-register commands each
	 * time. It computes a hash of all your commands, and stores it locally to
	 * the `.jellycommands` folder which you should add to your git ignore.
	 * When you run your bot it uses this to see if you made any changes to your
	 * commands. If you have it'll automatically re-register them!
	 *
	 * We recommend you leave this on, at least when developing.
	 *
	 * @default true
	 *
	 * @see https://jellycommands.dev/components/commands/caching
	 */
	cache?: boolean;

	/**
	 * Controls whether debug messages are logged to console.
	 * By default it's false, unless the `DEBUG` environment variable is set.
	 */
	debug?: boolean;

	/**
	 * Options to control how JellyCommands reads from the
	 * filesystem when loading components.
	 *
	 * @see https://jellycommands.dev/guides/fs
	 */
	fs?: {
		/**
		 * Only files that end in these extensions are loaded.
		 * @default ['.js', '.ts']
		 *
		 * @see https://jellycommands.dev/guides/fs#file-extensions
		 */
		extensions?: string[];
	};
}
