export const defaults = {
    /**
     * Set to ignore messages from other discord bots or not.
     */
    ignoreBots: true,

    /**
     * Default prefix for the bot.
     */
    prefix: '!',
};

export type JellyCommandsOptions = Partial<typeof defaults>;

import Joi from 'joi';

export const schema = Joi.object({
    ignoreBots: Joi.bool().required(),
    prefix: Joi.string().min(1).max(64).required(),
});
