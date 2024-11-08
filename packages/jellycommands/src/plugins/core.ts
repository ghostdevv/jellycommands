import { commandsPlugin } from '../components/commands/plugin';
import { buttonsPlugin } from '../components/buttons/plugin';
import { eventsPlugin } from '../components/events/plugin';
import type { AnyPlugin } from './plugins';

export const CORE_PLUGINS: AnyPlugin[] = [
	buttonsPlugin,
	commandsPlugin,
	eventsPlugin,
];
