export declare const defaults: {
    ignoreBots: boolean;
    defaultPrefix: string;
    perGuildPrefix: boolean;
};
export interface JellyCommandsOptions {
    ignoreBots?: boolean;
    defaultPrefix?: string;
    perGuildPrefix?: boolean;
}
import Joi from 'joi';
export declare const schema: Joi.ObjectSchema<any>;
