export const defaults = {
    // Ignore messages from other discord bots
    ignoreBots: true,

    // Prefix Settings
    defaultPrefix: '?',
    perGuildPrefix: false,
};

export interface JellyCommandsOptions {
    ignoreBots?: boolean;
    defaultPrefix?: string;
    perGuildPrefix?: boolean;
}

import Joi from 'joi';

export const schema = Joi.object({
    ignoreBots: Joi.bool().required(),
    defaultPrefix: Joi.string().min(1).max(64).required(),
    perGuildPrefix: Joi.bool().required(),
});
