import type { BaseCommandCallback } from '../../../commands/types/BaseCommand';
import { BaseCommand } from '../../../commands/types/BaseCommand';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { schema, MessageCommandOptions } from './options';
import type { ContextMenuInteraction } from 'discord.js';
import { removeKeys } from 'ghoststools';

export class MessageCommand extends BaseCommand<MessageCommandOptions, ContextMenuInteraction> {
    public readonly type = ApplicationCommandType.Message;

    constructor(run: BaseCommandCallback<ContextMenuInteraction>, options: MessageCommandOptions) {
        super(run, { options, schema });
    }
}

export const messageCommand = (
    options: MessageCommandOptions & {
        run: BaseCommandCallback<ContextMenuInteraction>;
    },
) => {
    return new MessageCommand(options.run, removeKeys(options, 'run') as MessageCommandOptions);
};
