import type { BaseCommandCallback } from '../../../commands/types/BaseCommand';
import { BaseCommand } from '../../../commands/types/BaseCommand';
import { ApplicationCommandType } from 'discord-api-types/v10';
import type { ContextMenuInteraction } from 'discord.js';
import { schema, UserCommandOptions } from './options';
import { removeKeys } from 'ghoststools';

export class UserCommand extends BaseCommand<UserCommandOptions, ContextMenuInteraction> {
    public readonly type = ApplicationCommandType.User;

    constructor(run: BaseCommandCallback<ContextMenuInteraction>, options: UserCommandOptions) {
        super(run, { options, schema });
    }
}

export const userCommand = (
    options: UserCommandOptions & {
        run: BaseCommandCallback<ContextMenuInteraction>;
    },
) => {
    return new UserCommand(options.run, removeKeys(options, 'run') as UserCommandOptions);
};
