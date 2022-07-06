import Joi from 'joi';

export const snowflake = () => Joi.string().length(18);
export const snowflakeArray = () => Joi.array().items(snowflake());

export const pathsSchema = () => [Joi.string(), Joi.array().items(Joi.string())];
