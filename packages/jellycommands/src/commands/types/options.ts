import type { BaseComponentOptions } from '../../components/components';
import type { InteractionDeferReplyOptions } from 'discord.js';
import { snowflakeSchema } from '../../utils/snowflake';
import type { PermissionResolvable } from 'discord.js';
import type { Locale } from 'discord-api-types/v10';
import { z } from 'zod';

export interface BaseOptions extends BaseComponentOptions {
	/**
	 * The name of the command
	 */
	name: string;

	/**
	 * Localize a command name to different languages
	 */
	nameLocalizations?: Partial<Record<Locale, string>>;

	/**
	 * Is the command in dev mode or not
	 */
	dev?: boolean;

	/**
	 * Should the interaction be defered?
	 */
	defer?: boolean | InteractionDeferReplyOptions;

	/**
	 * Guards allow you to prevent/allow certain people/groups to your command
	 */
	guards?: {
		/**
		 * The permissions a member must have to run this command
		 */
		permissions?: PermissionResolvable;
	};

	/**
	 * The guilds to apply the slash command in
	 */
	guilds?: string[];

	/**
	 * Should the slash command be global across all guilds
	 */
	global?: boolean;

	/**
	 * Should the slash command work in dms, this only works on global commands
	 * @default true
	 */
	dm?: boolean;
}

export const baseCommandSchema = z.object({
	name: z.string(),
	nameLocalizations: z.object({}).catchall(z.string()).optional(),
	dev: z.boolean().default(false).optional(),
	defer: z
		.union([
			z.boolean().default(false),
			z.object({
				ephemeral: z.boolean().optional(),
				fetchReply: z.boolean().optional(),
			}),
		])
		.optional(),

	guards: z
		.object({
			permissions: z.any(),
		})
		.optional(),
	guilds: snowflakeSchema.array().nonempty().optional(),
	global: z.boolean().default(false).optional(),
	dm: z.boolean().default(false).optional(),
	disabled: z.boolean().default(false).optional(),
});
