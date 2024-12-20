import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';
import type { ApplicationCommandType } from 'discord-api-types/v10';
import type { JellyCommands } from '../../../JellyCommands';
import type { MaybePromise } from '../../../utils/types';
import type { BaseOptions } from './options';
import type { AnyZodObject } from 'zod';
import type {
	CommandInteraction,
	ContextMenuCommandInteraction,
} from 'discord.js';

import { COMMAND_COMPONENT_ID } from '../plugin';
import { PermissionsBitField } from 'discord.js';
import { parseSchema } from '../../../utils/zod';
import { Component } from '../../components';
import { createHash } from 'node:crypto';

type AnyCommandInteraction = CommandInteraction | ContextMenuCommandInteraction;

export interface RunOptions<InteractionType extends AnyCommandInteraction> {
	interaction: InteractionType;
	client: JellyCommands;
	props: Props;
}

export type CommandCallback<InteractionType extends AnyCommandInteraction> = (
	options: RunOptions<InteractionType>,
) => MaybePromise<any>;

export abstract class BaseCommand<
	OptionsType extends BaseOptions = BaseOptions,
	InteractionType extends AnyCommandInteraction = AnyCommandInteraction,
> extends Component<OptionsType> {
	/**
	 * The options you pass to when creating this command.
	 */
	public readonly options: OptionsType;

	/**
	 * The callback function to call when your command is executed.
	 */
	public readonly run: CommandCallback<InteractionType>;

	/**
	 * The command type for API purposes.
	 */
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

		if (!run || typeof run !== 'function')
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

	/**
	 * This is for internal use and is subject to change.
	 */
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

	/**
	 * This is for internal use and is subject to change.
	 */
	get applicationCommandPermissions(): string | null {
		if (this.options.guards?.permissions) {
			const { bitfield } = new PermissionsBitField(
				this.options.guards.permissions,
			);
			return bitfield.toString();
		}

		return null;
	}

	/**
	 * This is for internal use and is subject to change.
	 */
	get hashId() {
		return createHash('sha256')
			.update(JSON.stringify(this.applicationCommandData))
			.digest('hex');
	}
}
