import type { JellyCommands } from '../JellyCommands';
import { BaseFeature } from '../features/features';
import { schema, EventOptions } from './options';
import type { Client, ClientEvents } from 'discord.js';
import { Awaitable } from '../utils/types';

export type EventCallback<EventName extends keyof ClientEvents> = (
    instance: { client: JellyCommands; props: Props },
    ...args: ClientEvents[EventName]
) => Awaitable<void | any>;

export class Event<T extends keyof ClientEvents = keyof ClientEvents> extends BaseFeature {
    public readonly options: EventOptions<T>;
    public readonly TYPE = 'EVENT';

    constructor(
        public readonly name: keyof ClientEvents,
        public readonly run: EventCallback<T>,
        options: EventOptions<T>,
    ) {
        super();

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
    const { run, ...rest } = options;
    return new Event<K>(options.name, run, rest);
};
