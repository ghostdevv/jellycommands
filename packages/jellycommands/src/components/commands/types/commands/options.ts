import type { JellyApplicationCommandOption } from './types';
import type { Locale } from 'discord-api-types/v10';
import { baseCommandSchema } from '../options';
import type { BaseOptions } from '../options';
import { z } from 'zod';

export interface CommandOptions extends BaseOptions {
	/**
	 * The description of the slash command
	 */
	description: string;

	/**
	 * Localize a command descriptions to different languages
	 */
	descriptionLocalizations?: Partial<Record<Locale, string>>;

	/**
	 * Options for the slash command
	 */
	options?: JellyApplicationCommandOption[];
}

export const commandSchema = baseCommandSchema.extend({
	name: z
		.string()
		.regex(
			// https://discord.com/developers/docs/interactions/application-commands#application-command-object
			/^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u,
			'Slash command name must be all lowercase, alphanumeric, and at most 32 chars long',
		)
		.refine(
			(name) => name.toLocaleLowerCase() === name,
			'Name must use lowercase chars where possible',
		),

	description: z
		.string({ required_error: 'Slash command description is required' })
		.min(1, 'Slash command description must be at least 1 char long')
		.max(100, 'Slash command description cannot exceed 100 chars'),

	descriptionLocalizations: z.object({}).catchall(z.string()).optional(),

	options: z.any().array().optional(),
});
