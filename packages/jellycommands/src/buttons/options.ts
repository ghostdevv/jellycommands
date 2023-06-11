import type { InteractionDeferReplyOptions } from 'discord.js';
import type { BaseFeatureOptions } from '../features/features';
import type { Awaitable } from '../utils/types';
import Joi from 'joi';

export interface ButtonOptions extends BaseFeatureOptions {
    /**
     * The customId of the button, or a regex/function to match against
     */
    id: string | RegExp | ((id: string) => Awaitable<boolean>);

    /**
     * Should the interaction be defered?
     */
    defer?: boolean | InteractionDeferReplyOptions;

    /**
     * Should the button be loaded?
     */
    disabled?: boolean;
}

export const schema = Joi.object({
    id: Joi.alternatives().try(Joi.string(), Joi.object().regex(), Joi.function()),

    defer: [
        Joi.bool(),
        Joi.object({
            ephemeral: Joi.bool(),
            fetchReply: Joi.bool(),
        }),
    ],

    disabled: Joi.bool().default(false),
});
