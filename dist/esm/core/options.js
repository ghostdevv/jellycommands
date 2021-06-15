export const defaults = {
    ignoreBots: true,
    defaultPrefix: '?',
    perGuildPrefix: false,
};
import Joi from 'joi';
export const schema = Joi.object({
    ignoreBots: Joi.bool().required(),
    defaultPrefix: Joi.string().min(1).max(64).required(),
    perGuildPrefix: Joi.bool().required(),
});
