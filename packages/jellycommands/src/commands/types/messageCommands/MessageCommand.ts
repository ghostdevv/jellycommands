import type { BaseCommandCallback } from '../../../commands/types/BaseCommand';
import { BaseCommand } from '../../../commands/types/BaseCommand';
import type { ContextMenuCommandInteraction } from 'discord.js';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { schema, MessageCommandOptions } from './options';
import { removeKeys } from 'ghoststools';

export class MessageCommand extends BaseCommand<
    MessageCommandOptions,
    ContextMenuCommandInteraction
> {
    public readonly type = ApplicationCommandType.Message;

    constructor(
        run: BaseCommandCallback<ContextMenuCommandInteraction>,
        options: MessageCommandOptions,
    ) {
        super(run, { options, schema });
    }
}

export const messageCommand = (
    options: MessageCommandOptions & {
        run: BaseCommandCallback<ContextMenuCommandInteraction>;
    },
) => {
    return new MessageCommand(options.run, removeKeys(options, 'run') as MessageCommandOptions);
};
