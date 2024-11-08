import type { CommandCallback } from '../../../commands/types/BaseCommand';
import type { UserContextMenuCommandInteraction } from 'discord.js';

import { userCommandSchema, type UserCommandOptions } from './options';
import { BaseCommand } from '../../../commands/types/BaseCommand';
import { ApplicationCommandType } from 'discord-api-types/v10';

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
