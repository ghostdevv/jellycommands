import type { ApplicationCommandOptionData } from 'discord.js';
import type { BaseOptions } from '../../base/options';
import { baseSchema } from '../../base/options';

export interface CommandOptions extends BaseOptions {
    /**
     * The description of the slash command
     */
    description: string;

    /**
     * Options for the slash command
     */
    options?: ApplicationCommandOptionData[];
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

    description: Joi.string().required(),

    options: Joi.array(),
});
