import Joi from 'joi';
import { BaseCommand } from '../JellyCommands/commands/base/BaseCommand.js';
import { Event } from '../JellyCommands/events/Event.js';
import { readFiles, readJSFile } from './fs.js';
import { pathsSchema } from './joi.js';

export async function loadCommands(
    commandsOrPaths: string | Array<string | BaseCommand>,
) {
    if (typeof commandsOrPaths === 'string') {
        return loadThing<BaseCommand>(commandsOrPaths);
    }

    let _commands: BaseCommand[] = [];

    for (const command of commandsOrPaths) {
        if (isCommand().validate(command)) {
            _commands.push(command as BaseCommand);
        } else {
            _commands.push(...(await loadThing<BaseCommand>(command)));
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
        if (isEvent().validate(event)) {
            _events.push(event as UserProvidedEvent);
        } else {
            _events.push(...(await loadThing<UserProvidedEvent>(event)));
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
    Joi.array().items(isCommand()),
    ...pathsSchema(),
];

const isEvent = () => Joi.object().instance(Event);
export const arrayOfEventsOrPaths = () => [
    Joi.array().items(isEvent()),
    ...pathsSchema(),
];
