import type { JellyCommands } from '../JellyCommands';
import { eventSchema, EventOptions } from './options';
import type { ClientEvents } from 'discord.js';
import { MaybePromise } from '../utils/types';
import { parseSchema } from '../utils/zod';

export type EventName = keyof ClientEvents | (string & {});

export type EventCallback<E extends EventName> = (
    ctx: { client: JellyCommands; props: Props },
    ...args: E extends keyof ClientEvents ? ClientEvents[E] : any[]
) => MaybePromise<void | any>;

export class Event<T extends EventName = EventName> {
    public readonly options: Required<EventOptions<T>>;

    constructor(
        public readonly name: EventName,
        public readonly run: EventCallback<T>,
        options: EventOptions<T>,
    ) {
        if (!name || typeof name != 'string')
            throw new TypeError(`Expected type string for name, received ${typeof name}`);

        if (!run || typeof run != 'function')
            throw new TypeError(`Expected type function for run, received ${typeof run}`);

        this.options = <Required<EventOptions<T>>>(
            parseSchema('event options', eventSchema, options)
        );
    }
}

export const event = <K extends EventName>(
    options: EventOptions<K> & {
        run: EventCallback<K>;
    },
) => {
    const { run, ...rest } = options;
    return new Event<K>(options.name, run, rest);
};
