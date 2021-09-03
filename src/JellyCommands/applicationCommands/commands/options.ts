import type { ApplicationCommandOptionData } from 'discord.js';
import type { BaseOptions } from '../BaseCommand';
import { baseSchema } from '../BaseCommand';

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
    description: Joi.string().required(),

    options: Joi.array(),
});
