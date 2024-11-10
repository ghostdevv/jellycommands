import { eventSchema, type EventOptions } from './options';
import type { JellyCommands } from '../../JellyCommands';
import { Component, isComponent } from '../components';
import type { MaybePromise } from '../../utils/types';
import { EVENTS_COMPONENT_ID } from './plugin';
import type { ClientEvents } from 'discord.js';
import { parseSchema } from '../../utils/zod';

/**
 * The Discord event name
 *
 * @see https://jellycommands.dev/components/events
 * @see https://discord.js.org/docs/packages/discord.js/14.16.3/ClientEvents:Interface
 */
export type EventName = keyof ClientEvents | (string & {});

/**
 * This callback will be run when your event is fired.
 * It takes in a base JellyCommands context as it's first param,
 * followed by all the arguments your event provides.
 *
 * @see https://jellycommands.dev/components/events#handling-events
 */
export type EventCallback<E extends EventName> = (
	ctx: { client: JellyCommands; props: Props },
	...args: E extends keyof ClientEvents ? ClientEvents[E] : any[]
) => MaybePromise<any>;

/**
 * A component for handling Discord.js events.
 * @see https://jellycommands.dev/components/events
 */
export class Event<T extends EventName = EventName> extends Component {
	/**
	 * The options you pass to when creating this event.
	 */
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

	/**
	 * Type narrowing utility to check whether something is an event.
	 * @param item The thing to check
	 */
	static is(item: any): item is Event {
		return isComponent(item) && item.id === EVENTS_COMPONENT_ID;
	}
}

/**
 * This creates an event component for your bot. Events can be used
 * to respond to actions such as a new user joining a guild.
 *
 * @see https://jellycommands.dev/components/events
 */
export const event = <K extends EventName>(
	options: EventOptions<K> & {
		/**
		 * This callback will be run when your event is fired.
		 * It takes in a base JellyCommands context as it's first param,
		 * followed by all the arguments your event provides.
		 *
		 * @see https://jellycommands.dev/components/events#handling-events
		 */
		run: EventCallback<K>;
	},
) => {
	const { run, ...rest } = options;
	return new Event<K>(options.name, run, rest);
};
