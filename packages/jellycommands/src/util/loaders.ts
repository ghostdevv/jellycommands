import Joi from 'joi';
import { BaseCommand } from '../JellyCommands/commands/base/BaseCommand.js';
import { Event } from '../JellyCommands/events/Event.js';
import { readFiles, readJSFile } from './fs.js';

export async function loadCommands(
    commandsOrPaths: string | Array<string | BaseCommand>,
) {
    if (typeof commandsOrPaths === 'string') {
        return loadThing<BaseCommand>(commandsOrPaths);
    }

    let _commands: BaseCommand[] = [];

    for (const command of commandsOrPaths) {
        if (isCommand().validate(command).error) {
            _commands.push(...(await loadThing<BaseCommand>(command)));
        } else {
            _commands.push(command as BaseCommand);
        }
    }

    return _commands;
}

export async function loadEvents(
    eventsOrPaths: string | Array<string | UserProvidedEvent>,
) {
    if (typeof eventsOrPaths === 'string') {
        return loadThing<UserProvidedEvent>(eventsOrPaths);
    }

    let _events: UserProvidedEvent[] = [];

    for (const event of eventsOrPaths) {
        if (isEvent().validate(event).error) {
            _events.push(...(await loadThing<UserProvidedEvent>(event)));
        } else {
            _events.push(event as UserProvidedEvent);
        }
    }

    return _events;
}

async function loadThing<T>(path: any) {
    return Promise.all(readFiles(path).map<Promise<T>>(readJSFile));
}

/**
 * @todo get rid of this
 */
export type UserProvidedEvent = InstanceType<typeof Event>;

const isCommand = () => Joi.object().instance(BaseCommand);
export const arrayOfCommandsOrPaths = () => [
    Joi.string(),
    Joi.array().items(isCommand(), Joi.string()),
];

const isEvent = () => Joi.object().instance(Event);
export const arrayOfEventsOrPaths = () => [
    Joi.string(),
    Joi.array().items(isEvent(), Joi.string()),
];
