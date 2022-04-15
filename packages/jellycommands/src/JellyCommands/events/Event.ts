import { schema, EventOptions } from './options';
import { removeKeys } from 'ghoststools';

import type { JellyCommands } from '../JellyCommands';
import type { ClientEvents } from 'discord.js';

type Awaitable<T> = Promise<T> | T;

export type EventCallback<EventName extends keyof ClientEvents> = (
    instance: { client: JellyCommands },
    ...args: ClientEvents[EventName]
) => Awaitable<void>;

export class Event<T extends keyof ClientEvents> {
    public readonly name: keyof ClientEvents;
    public readonly run: EventCallback<T>;
    public readonly options: Required<EventOptions<T>>;

    constructor(
        name: keyof ClientEvents,
        run: Event<T>['run'],
        options: EventOptions<T>,
    ) {
        this.name = name;

        if (!name || typeof name != 'string')
            throw new TypeError(
                `Expected type string for name, received ${typeof name}`,
            );

        this.run = run;

        if (!run || typeof run != 'function')
            throw new TypeError(
                `Expected type function for run, received ${typeof run}`,
            );

        const { error, value } = schema.validate(options);

        if (error) throw error.annotate();
        else this.options = value;
    }
}

export const event = <K extends keyof ClientEvents>(
    options: EventOptions<K> & {
        run: EventCallback<K>;
    },
) => {
    return new Event<K>(
        options.name,
        options.run,
        removeKeys(options, 'run') as EventOptions<K>,
    );
};
