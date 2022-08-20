import type { BaseOptions } from '../../../commands/types/options';
import { baseSchema } from '../../../commands/types/options';
import type { ApplicationCommandOption } from 'discord.js';
import type { Locale } from 'discord-api-types/v10';

export interface CommandOptions extends BaseOptions {
    /**
     * The description of the slash command
     */
    description: string;

    /**
     * Localize a command descriptions to different languages
     */
    descriptionLocalizations?: Record<Locale, string>;

    /**
     * Options for the slash command
     */
    options?: ApplicationCommandOption[];
}

import Joi from 'joi';

export const schema = baseSchema.append({
    // Enforce good registration rule
    name: Joi.string()
        .required()
        .prefs({ convert: false })
        .ruleset.lowercase()
        .min(1)
        .max(32)
        .pattern(/^[a-z0-9]+$/)
        .rule({
            message:
                'Slash Command names must be 1 - 32 characters, all lowercase with no witespaces or special chars',
        }),

    description: Joi.string().min(1).max(100).required(),
    descriptionLocalizations: Joi.object(),

    options: Joi.array(),
});
