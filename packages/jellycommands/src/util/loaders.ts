import Joi from 'joi';
import { BaseCommand } from '../JellyCommands/commands/base/BaseCommand.js';
import { Event } from '../JellyCommands/events/Event.js';
import { readFiles, readJSFile } from './fs.js';

export async function loadCommands(paths: string | string[]) {
    return Promise.all(readFiles(paths).map<Promise<BaseCommand>>(readJSFile));
}

export async function loadEvents(paths: string | string[]) {
    return Promise.all(
        readFiles(paths).map<Promise<UserProvidedEvent>>(readJSFile),
    );
}

/**
 * @todo get rid of this
 */
export type UserProvidedEvent = InstanceType<typeof Event>;

const isCommand = () => Joi.object().instance(BaseCommand);
export const arrayOfCommands = () => Joi.array().items(isCommand());

const isEvent = () => Joi.object().instance(Event);
export const arrayOfEvents = () => Joi.array().items(isEvent());
