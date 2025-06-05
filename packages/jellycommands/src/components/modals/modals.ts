import { type ModalOptions, modalSchema } from './options';
import type { JellyCommands } from '../../JellyCommands';
import type { ModalSubmitInteraction } from 'discord.js';
import { Component, isComponent } from '../components';
import type { MaybePromise } from '../../utils/types';
import { MODALS_COMPONENT_ID } from './plugin';
import { parseSchema } from '../../utils/zod';

export type ModalCallback = (context: {
	client: JellyCommands;
	props: Props;
	interaction: ModalSubmitInteraction;
}) => MaybePromise<any>;

/**
 * Represents a modal.
 * @see https://jellycommands.dev/components/modals
 */
export class Modal extends Component<ModalOptions> {
	public readonly options: ModalOptions;

	constructor(
		_options: ModalOptions,
		public readonly run: ModalCallback,
	) {
		super(MODALS_COMPONENT_ID, 'Modal');
		this.options = parseSchema('modal', modalSchema, _options);
	}

	static is(item: any): item is Modal {
		return isComponent(item) && item.id === MODALS_COMPONENT_ID;
	}
}

/**
 * Creates a modal.
 * @see https://jellycommands.dev/components/modals
 */
export const modal = (options: ModalOptions & { run: ModalCallback }) => {
	const { run, ...rest } = options;
	return new Modal(rest, run);
};
