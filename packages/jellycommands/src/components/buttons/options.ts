import type { InteractionDeferReplyOptions } from 'discord.js';
import type { BaseComponentOptions } from '../components';
import type { MaybePromise } from '../../utils/types';
import { z } from 'zod';

export interface ButtonOptions extends BaseComponentOptions {
	/**
	 * The customId of the button, or a regex/function to match against
	 */
	id: string | RegExp | ((id: string) => MaybePromise<boolean>);

	/**
	 * Should the interaction be defered?
	 */
	defer?: boolean | InteractionDeferReplyOptions;
}

export const buttonSchema = z.object({
	id: z.union([
		z.string(),
		z.instanceof(RegExp),
		// todo test this
		z
			.function()
			.args(z.string().optional())
			.returns(z.union([z.boolean(), z.promise(z.boolean())])),
	]),

	defer: z
		.union([
			z.boolean().default(false),
			z.object({
				ephemeral: z.boolean().optional(),
				fetchReply: z.boolean().optional(),
			}),
		])
		.optional(),

	disabled: z.boolean().default(false).optional(),
});
