import type { Awaitable } from '../utils/types';
import Joi from 'joi';

// TODO look at interaction options, such as defer, ephermal etc

export interface ButtonOptions {
    id: string | RegExp | ((id: string) => Awaitable<boolean>);
}

export const schema = Joi.object({
    id: Joi.alternatives().try(Joi.string(), Joi.object().regex(), Joi.function()),
});
