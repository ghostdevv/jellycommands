import type { ClientEvents } from 'discord.js';
export declare const defaults: {
    name: keyof ClientEvents;
    disabled: boolean;
    once: boolean;
};
import Joi from 'joi';
export declare const schema: Joi.ObjectSchema<any>;
