import type { BaseCommandCallback } from '../../../commands/types/BaseCommand';
import { BaseCommand } from '../../../commands/types/BaseCommand';
import type { ContextMenuCommandInteraction } from 'discord.js';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { schema, UserCommandOptions } from './options';
import { removeKeys } from 'ghoststools';

export class UserCommand extends BaseCommand<UserCommandOptions, ContextMenuCommandInteraction> {
    public readonly type = ApplicationCommandType.User;

    constructor(
        run: BaseCommandCallback<ContextMenuCommandInteraction>,
        options: UserCommandOptions,
    ) {
        super(run, { options, schema });
    }
}

export const userCommand = (
    options: UserCommandOptions & {
        run: BaseCommandCallback<ContextMenuCommandInteraction>;
    },
) => {
    return new UserCommand(options.run, removeKeys(options, 'run') as UserCommandOptions);
};
