import type { UserContextMenuCommandInteraction } from 'discord.js';
import type { CommandCallback } from '../BaseCommand';

import { userCommandSchema, type UserCommandOptions } from './options';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { BaseCommand } from '../BaseCommand';

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

export const userCommand = (
	options: UserCommandOptions & {
		run: CommandCallback<UserContextMenuCommandInteraction>;
	},
) => {
	const { run, ...rest } = options;
	return new UserCommand(run, rest);
};
