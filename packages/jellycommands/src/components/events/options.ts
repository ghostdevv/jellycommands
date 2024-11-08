import type { BaseComponentOptions } from '../components';
import type { EventName } from './Event';

export interface EventOptions<Event extends EventName>
	extends BaseComponentOptions {
	/**
	 * The Discord event name
	 * @see https://discord.js.org/docs/packages/discord.js/14.16.3/ClientEvents:Interface
	 */
	name: Event;

	/**
	 * Should the event be ran once or every time it's received
	 * @default false
	 */
	once?: boolean;
}

import { z } from 'zod';

export const eventSchema = z.object({
	name: z.string() as z.ZodType<EventName>,
	disabled: z.boolean().default(false),
	once: z.boolean().default(false),
});
