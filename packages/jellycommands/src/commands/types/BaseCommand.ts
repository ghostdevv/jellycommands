import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';
import type {
	CommandInteraction,
	ContextMenuCommandInteraction,
} from 'discord.js';
import type { ApplicationCommandType } from 'discord-api-types/v10';
import type { JellyCommands } from '../../JellyCommands';
import type { MaybePromise } from '../../utils/types';
import type { BaseOptions } from './options';
import type { AnyZodObject } from 'zod';

import { Component } from '../../components/components';
import { PermissionsBitField } from 'discord.js';
import { COMMAND_COMPONENT_ID } from '../plugin';
import { parseSchema } from '../../utils/zod';
import { createHash } from 'crypto';

type AnyCommandInteraction = CommandInteraction | ContextMenuCommandInteraction;

export interface RunOptions<InteractionType extends AnyCommandInteraction> {
	interaction: InteractionType;
	client: JellyCommands;
	props: Props;
}

export type CommandCallback<InteractionType extends AnyCommandInteraction> = (
	options: RunOptions<InteractionType>,
) => MaybePromise<void | any>;

export abstract class BaseCommand<
	OptionsType extends BaseOptions = BaseOptions,
	InteractionType extends AnyCommandInteraction = AnyCommandInteraction,
> extends Component<OptionsType> {
	public readonly options: OptionsType;
	public readonly run: CommandCallback<InteractionType>;

	public abstract readonly type: ApplicationCommandType;

	constructor({
		run,
		options,
		schema,
	}: {
		options: OptionsType;
		schema: AnyZodObject;
		run: CommandCallback<InteractionType>;
	}) {
		super(COMMAND_COMPONENT_ID, 'todo');

		if (!run || typeof run != 'function')
			throw new TypeError(
				`Expected type function for run, received ${typeof run}`,
			);

		this.options = parseSchema('command', schema, options) as OptionsType;
		this.run = run;

		if (
			!this.options.guilds?.length &&
			!this.options.global &&
			!this.options.dev
		)
			throw new Error(
				'Command must have at least one of guild, global, or dev',
			);

		if (
			this.options.global &&
			!this.options.guilds?.length &&
			this.options.guards
		) {
			throw new Error(
				'If using guards on a global command you must have a guilds array, guards can only be applied to guilds',
			);
		}
	}

	get applicationCommandData(): RESTPostAPIApplicationCommandsJSONBody {
		return {
			name: this.options.name,
			type: this.type,
			description: '',
			default_member_permissions: this.applicationCommandPermissions,
			dm_permission: this.options.dm ?? true,
			name_localizations: this.options.nameLocalizations,
		};
	}

	get applicationCommandPermissions(): string | null {
		if (this.options.guards?.permissions) {
			const { bitfield } = new PermissionsBitField(
				this.options.guards.permissions,
			);
			return bitfield.toString();
		}

		return null;
	}

	get hashId() {
		return createHash('sha256')
			.update(JSON.stringify(this.applicationCommandData))
			.digest('hex');
	}
}
