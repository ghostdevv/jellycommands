export const defaults = {
    /**
     * Set to ignore messages from other discord bots or not.
     */
    ignoreBots: true,

    /**
     * Default prefix for the bot.
     */
    defaultPrefix: '?',
    /**
     * Set the prefix to global (false) or per guild (true).
     *
     * Global prefix means that the same prefix is used in all guilds.
     *
     * Per Guild means that each guild can have a different prefix.
     */
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
