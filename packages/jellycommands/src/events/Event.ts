import type { JellyCommands } from '../JellyCommands';
import { schema, EventOptions } from './options';
import type { ClientEvents } from 'discord.js';
import { parseSchema } from '../utils/zod';
import { MaybePromise } from '../utils/types';

export type EventCallback<EventName extends keyof ClientEvents> = (
    instance: { client: JellyCommands; props: Props },
    ...args: ClientEvents[EventName]
) => MaybePromise<void | any>;

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

        this.options = parseSchema('event options', schema, options) as Required<EventOptions<T>>;
    }
}

export const event = <K extends keyof ClientEvents>(
    options: EventOptions<K> & {
        run: EventCallback<K>;
    },
) => {
    const { run, ...rest } = options;
    return new Event<K>(options.name, run, rest);
};
