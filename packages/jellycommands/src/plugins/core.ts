import { buttonsPlugin } from '../buttons/plugin';
import { commandsPlugin } from '../commands/plugin';
import { eventsPlugin } from '../events/plugin';
import type { AnyPlugin } from './plugins';

export const CORE_PLUGINS: AnyPlugin[] = [
	buttonsPlugin,
	commandsPlugin,
	eventsPlugin,
];
