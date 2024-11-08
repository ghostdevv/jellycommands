import type { MessageContextMenuCommandInteraction } from 'discord.js';
import type { CommandCallback } from '../BaseCommand';

import { messageCommandSchema, type MessageCommandOptions } from './options';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { BaseCommand } from '../BaseCommand';

export class MessageCommand extends BaseCommand<
	MessageCommandOptions,
	MessageContextMenuCommandInteraction
> {
	public readonly type = ApplicationCommandType.Message;

	constructor(
		run: CommandCallback<MessageContextMenuCommandInteraction>,
		options: MessageCommandOptions,
	) {
		super({ run, options, schema: messageCommandSchema });
	}
}

export const messageCommand = (
	options: MessageCommandOptions & {
		run: CommandCallback<MessageContextMenuCommandInteraction>;
	},
) => {
	const { run, ...rest } = options;
	return new MessageCommand(run, rest);
};
