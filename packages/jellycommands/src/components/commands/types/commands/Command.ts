import type { APIApplicationCommandOption } from 'discord-api-types/v10';
import { commandSchema, type CommandOptions } from './options';
import { ApplicationCommandType } from 'discord-api-types/v10';
import type { JellyCommands } from '../../../../JellyCommands';
import type { JellyApplicationCommandOption } from './types';
import type { MaybePromise } from '../../../../utils/types';
import type { CommandCallback } from '../BaseCommand';
import { ApplicationCommand } from 'discord.js';
import { BaseCommand } from '../BaseCommand';
import {
	type AutocompleteInteraction,
	type ApplicationCommandOption,
	type ApplicationCommandOptionData,
	type ChatInputCommandInteraction,
	ApplicationCommandOptionType,
} from 'discord.js';

export type AutocompleteHandler = (options: {
	interaction: AutocompleteInteraction;
	client: JellyCommands;
}) => MaybePromise<any>;

/**
 * Represents a slash command.
 * @see https://jellycommands.dev/guide/commands/files/#slash-commands
 */
export class Command extends BaseCommand<
	CommandOptions,
	ChatInputCommandInteraction
> {
	public readonly type = ApplicationCommandType.ChatInput;

	public readonly autocomplete?: AutocompleteHandler;

	constructor({
		run,
		options,
		autocomplete,
	}: {
		run: CommandCallback<ChatInputCommandInteraction>;
		options: CommandOptions;
		autocomplete?: AutocompleteHandler;
	}) {
		super({ run, options, schema: commandSchema });

		if (autocomplete && typeof autocomplete !== 'function') {
			throw new TypeError('Autocomplete handler must be a function');
		}

		this.autocomplete = autocomplete;
	}

	/**
	 * This is for internal use and is subject to change.
	 */
	static transformOptionType(
		option: JellyApplicationCommandOption,
	): ApplicationCommandOptionData {
		const type =
			typeof option.type === 'string'
				? ApplicationCommandOptionType[option.type]
				: option.type;

		if (!type)
			throw new Error(
				`Unable to find Slash Command Option type "${option.type}", see https://discord-api-types.dev/api/discord-api-types-v10/enum/ApplicationCommandOptionType`,
			);

		let options: ApplicationCommandOptionData[] | undefined;

		if ('options' in option && Array.isArray(option.options)) {
			options = option.options?.map((o) =>
				Command.transformOptionType(o),
			);
		}

		// @ts-expect-error type mismatch
		return { ...option, options, type } as ApplicationCommandOption;
	}

	/**
	 * This is for internal use and is subject to change.
	 */
	static transformOption(
		option: JellyApplicationCommandOption,
	): APIApplicationCommandOption {
		const patched = Command.transformOptionType(option);

		const transform =
			// @ts-expect-error todo
			ApplicationCommand.transformOption.bind(ApplicationCommand);
		return transform(patched, false) as APIApplicationCommandOption;
	}

	get applicationCommandData() {
		const options = this.options.options?.map((o) =>
			Command.transformOption(o),
		);

		return {
			...super.applicationCommandData,
			description: this.options.description,
			description_localizations: this.options.descriptionLocalizations,
			options,
		};
	}
}

/**
 * Creates a slash command.
 * @see https://jellycommands.dev/guide/commands/files/#slash-commands
 */
export const command = (
	options: CommandOptions & {
		/**
		 * The callback function to call when your command is executed.
		 */
		run: CommandCallback<ChatInputCommandInteraction>;
		autocomplete?: AutocompleteHandler;
	},
) => {
	const { run, autocomplete, ...rest } = options;

	return new Command({
		run,
		autocomplete,
		options: rest,
	});
};
