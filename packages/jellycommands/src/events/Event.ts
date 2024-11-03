import type { JellyCommands } from '../JellyCommands';
import { eventSchema, EventOptions } from './options';
import { Feature, isFeature } from '../features/features';
import type { ClientEvents } from 'discord.js';
import { MaybePromise } from '../utils/types';
import { parseSchema } from '../utils/zod';

// eslint-disable-next-line @typescript-eslint/ban-types
export type EventName = keyof ClientEvents | (string & {});

export type EventCallback<E extends EventName> = (
    ctx: { client: JellyCommands; props: Props },
    ...args: E extends keyof ClientEvents ? ClientEvents[E] : any[]
) => MaybePromise<void | any>;

export class Event<T extends EventName = EventName> extends Feature {
    public readonly options: Required<EventOptions<T>>;

    constructor(
        public readonly name: EventName,
        public readonly run: EventCallback<T>,
        _options: EventOptions<T>,
    ) {
        super('jellycommands.event', 'Event');

        if (!name || typeof name != 'string')
            throw new TypeError(`Expected type string for name, received ${typeof name}`);

        if (!run || typeof run != 'function')
            throw new TypeError(`Expected type function for run, received ${typeof run}`);

        this.options = <Required<EventOptions<T>>>(
            parseSchema('event options', eventSchema, _options)
        );
    }

    static async register(client: JellyCommands, event: Event<any>) {
        async function cb(...ctx: any[]) {
            try {
                await event.run({ client, props: client.props }, ...ctx);
            } catch (error) {
                console.error(`There was an error running event ${event.name}`, error);
            }
        }

        event.options.once ? client.once(event.name, cb) : client.on(event.name, cb);
    }

    static is(item: any): item is Event {
        return isFeature(item) && item.id === 'jellycommands.event';
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
