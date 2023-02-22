import type { CommandCallback } from '../../../commands/types/BaseCommand';
import { BaseCommand } from '../../../commands/types/BaseCommand';
import type { ContextMenuCommandInteraction } from 'discord.js';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { schema, MessageCommandOptions } from './options';

export class MessageCommand extends BaseCommand<
    MessageCommandOptions,
    ContextMenuCommandInteraction
> {
    public readonly type = ApplicationCommandType.Message;

    constructor(
        run: CommandCallback<ContextMenuCommandInteraction>,
        options: MessageCommandOptions,
    ) {
        super({ run, options, schema });
    }
}

export const messageCommand = (
    options: MessageCommandOptions & {
        run: CommandCallback<ContextMenuCommandInteraction>;
    },
) => {
    const { run, ...rest } = options;
    return new MessageCommand(run, rest);
};
