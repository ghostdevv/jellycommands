import { type ModalOptions, modalSchema, type ModalField } from './options';
import type { JellyCommands } from '../../JellyCommands';
import type { ModalSubmitInteraction } from 'discord.js';
import { Component, isComponent } from '../components';
import type { MaybePromise } from '../../utils/types';
import { MODALS_COMPONENT_ID } from './plugin';
import { parseSchema } from '../../utils/zod';

type InputComponentMapper<T extends ModalField> = {
	[K in T as K['customId']]: K['required'] extends false
		? string | null
		: string;
};

export type ModalCallback<T extends ModalField> = (context: {
	client: JellyCommands;
	props: Props;
	interaction: ModalSubmitInteraction;
	fields: InputComponentMapper<T>;
}) => MaybePromise<any>;

/**
 * Represents a modal.
 * @see https://jellycommands.dev/components/modals
 */
export class Modal<T extends ModalField> extends Component<ModalOptions<T>> {
	public readonly options: ModalOptions<T>;

	constructor(
		_options: ModalOptions<T>,
		public readonly run: ModalCallback<any>,
	) {
		super(MODALS_COMPONENT_ID, 'Modal');
		this.options = parseSchema(
			'modal',
			modalSchema,
			_options,
		) as ModalOptions<T>;
	}

	static is(item: any): item is Modal<any> {
		return isComponent(item) && item.id === MODALS_COMPONENT_ID;
	}
}

/**
 * Creates a modal.
 * @see https://jellycommands.dev/components/modals
 */
export const modal = <const T extends ModalField>(
	options: ModalOptions<T> & { run: ModalCallback<T> },
) => {
	const { run, ...rest } = options;
	return new Modal(rest, run);
};
