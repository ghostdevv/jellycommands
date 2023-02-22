import type { JellyCommands } from '../JellyCommands';
import { schema, EventOptions } from './options';
import type { ClientEvents } from 'discord.js';
import { Awaitable } from '../utils/types';
import { removeKeys } from 'ghoststools';

export type EventCallback<EventName extends keyof ClientEvents> = (
    instance: { client: JellyCommands; props: Props },
    ...args: ClientEvents[EventName]
) => Awaitable<void | any>;

export class Event<T extends keyof ClientEvents = keyof ClientEvents> {
    public readonly options: Required<EventOptions<T>>;

    constructor(
        public readonly name: keyof ClientEvents,
        public readonly run: EventCallback<T>,
        options: EventOptions<T>,
    ) {
        if (!name || typeof name != 'string')
            throw new TypeError(`Expected type string for name, received ${typeof name}`);

        if (!run || typeof run != 'function')
            throw new TypeError(`Expected type function for run, received ${typeof run}`);

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
    return new Event<K>(options.name, options.run, removeKeys(options, 'run') as EventOptions<K>);
};
