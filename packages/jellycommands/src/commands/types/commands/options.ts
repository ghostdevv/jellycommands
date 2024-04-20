import { z } from 'zod';
import { baseCommandSchema } from '../../../commands/types/options';
import type { BaseOptions } from '../../../commands/types/options';
import type { JellyApplicationCommandOption } from './types';
import type { Locale } from 'discord-api-types/v10';

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
        .min(1, 'Slash command name must be at least 1 char long')
        .max(32, 'Slash command name cannot exceed 32 chars')
        .regex(
            /^[a-z0-9]+$/,
            'Slash command name must be all lowercase, alphanumeric, and at most 32 chars long',
        )
        .refine((str) => str.toLowerCase() == str, 'Slash command name must be lowercase'),

    description: z
        .string({ required_error: 'Slash command description is required' })
        .min(1, 'Slash command description must be at least 1 char long')
        .max(100, 'Slash command description cannot exceed 100 chars'),

    descriptionLocalizations: z.object({}).catchall(z.string()).optional(),

    options: z.any().array().optional(),
});
