import type { CommandCallback } from '../../../commands/types/BaseCommand';
import { userCommandSchema, UserCommandOptions } from './options';
import { BaseCommand } from '../../../commands/types/BaseCommand';
import type { ContextMenuCommandInteraction } from 'discord.js';
import { ApplicationCommandType } from 'discord-api-types/v10';

export class UserCommand extends BaseCommand<UserCommandOptions, ContextMenuCommandInteraction> {
    public readonly type = ApplicationCommandType.User;

    constructor(run: CommandCallback<ContextMenuCommandInteraction>, options: UserCommandOptions) {
        super({ run, options, schema: userCommandSchema });
    }
}

export const userCommand = (
    options: UserCommandOptions & {
        run: CommandCallback<ContextMenuCommandInteraction>;
    },
) => {
    const { run, ...rest } = options;
    return new UserCommand(run, rest);
};
