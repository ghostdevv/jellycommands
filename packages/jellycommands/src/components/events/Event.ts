import { eventSchema, type EventOptions } from './options';
import type { JellyCommands } from '../../JellyCommands';
import { Component, isComponent } from '../components';
import type { MaybePromise } from '../../utils/types';
import { EVENTS_COMPONENT_ID } from './plugin';
import type { ClientEvents } from 'discord.js';
import { parseSchema } from '../../utils/zod';

export type EventName = keyof ClientEvents | (string & {});

export type EventCallback<E extends EventName> = (
	ctx: { client: JellyCommands; props: Props },
	...args: E extends keyof ClientEvents ? ClientEvents[E] : any[]
) => MaybePromise<any>;

export class Event<T extends EventName = EventName> extends Component {
	public readonly options: Required<EventOptions<T>>;

	constructor(
		public readonly name: EventName,
		public readonly run: EventCallback<T>,
		_options: EventOptions<T>,
	) {
		super(EVENTS_COMPONENT_ID, 'Event');

		if (!name || typeof name !== 'string')
			throw new TypeError(
				`Expected type string for name, received ${typeof name}`,
			);

		if (!run || typeof run !== 'function')
			throw new TypeError(
				`Expected type function for run, received ${typeof run}`,
			);

		this.options = <Required<EventOptions<T>>>(
			parseSchema('event options', eventSchema, _options)
		);
	}

	static is(item: any): item is Event {
		return isComponent(item) && item.id === EVENTS_COMPONENT_ID;
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
