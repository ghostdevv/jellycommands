import type { UserContextMenuCommandInteraction } from 'discord.js';
import type { CommandCallback } from '../BaseCommand';

import { userCommandSchema, type UserCommandOptions } from './options';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { BaseCommand } from '../BaseCommand';

/**
 * Represents a User Context Menu command.
 * @see https://jellycommands.dev/guide/commands/files/#user-commands
 */
export class UserCommand extends BaseCommand<
	UserCommandOptions,
	UserContextMenuCommandInteraction
> {
	public readonly type = ApplicationCommandType.User;

	constructor(
		run: CommandCallback<UserContextMenuCommandInteraction>,
		options: UserCommandOptions,
	) {
		super({ run, options, schema: userCommandSchema });
	}
}

/**
 * Creates a User Context Menu command.
 * @see https://jellycommands.dev/guide/commands/files/#user-commands
 */
export const userCommand = (
	options: UserCommandOptions & {
		/**
		 * The callback function to call when your command is executed.
		 */
		run: CommandCallback<UserContextMenuCommandInteraction>;
	},
) => {
	const { run, ...rest } = options;
	return new UserCommand(run, rest);
};