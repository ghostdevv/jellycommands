import type { JellyCommands } from '../core/JellyCommands';
import type { Client, ClientEvents } from 'discord.js';
import { defaults, schema } from './options';
import { removeKeys } from 'ghoststools';

export class Event {
    public readonly name: keyof ClientEvents;
    public readonly run: Function;
    public readonly options: typeof defaults;

    constructor(
        name: keyof ClientEvents,
        run: Function,
        options: Partial<typeof defaults>,
    ) {
        this.name = name;

        if (!name || typeof name != 'string')
            throw new TypeError(
                `Expected type string for name, recieved ${typeof name}`,
            );

        this.run = run;

        if (!run || typeof run != 'function')
            throw new TypeError(
                `Expected type function for run, recieved ${typeof run}`,
            );

        const { error, value } = schema.validate(
            Object.assign(defaults, options),
        );

        if (error) throw error.annotate();
        else this.options = value;
    }
}

export const createEvent = <K extends keyof ClientEvents>(
    name: K,
    options: Partial<typeof defaults> & {
        run: (
            instance: { client: Client; jelly: JellyCommands },
            ...args: ClientEvents[K]
        ) => void | any;
    },
) => {
    return new Event(name, options.run, removeKeys(options, 'run'));
};
