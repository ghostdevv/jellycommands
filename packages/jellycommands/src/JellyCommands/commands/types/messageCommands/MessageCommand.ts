import type { BaseCommandCallback } from '../../base/BaseCommand';
import { ApplicationCommandType } from 'discord-api-types/v9';
import { schema, MessageCommandOptions } from './options';
import type { ContextMenuInteraction } from 'discord.js';
import { BaseCommand } from '../../base/BaseCommand';
import { removeKeys } from 'ghoststools';

export class MessageCommand extends BaseCommand<
    MessageCommandOptions,
    ContextMenuInteraction
> {
    constructor(
        run: BaseCommand<MessageCommandOptions, ContextMenuInteraction>['run'],
        options: MessageCommandOptions,
    ) {
        super(run, { options, schema });
    }

    get applicationCommandData() {
        const default_permission = this.options.guards
            ? this.options.guards.mode == 'blacklist'
            : true;

        return {
            name: this.options.name,
            type: ApplicationCommandType.Message,
            description: '',
            default_permission,
        };
    }
}

export const messageCommand = (
    options: MessageCommandOptions & {
        run: BaseCommandCallback<ContextMenuInteraction>;
    },
) => {
    return new MessageCommand(
        options.run,
        removeKeys(options, 'run') as MessageCommandOptions,
    );
};
