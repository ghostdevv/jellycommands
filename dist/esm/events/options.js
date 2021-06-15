export const defaults = {
    name: '',
    disabled: false,
    once: false,
};
import Joi from 'joi';
export const schema = Joi.object({
    name: Joi.string().required(),
    disabled: Joi.bool().required(),
    once: Joi.bool().required(),
    run: Joi.func().required(),
});
