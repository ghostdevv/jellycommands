import type { BaseCommandCallback } from '../../../commands/types/BaseCommand';
import { BaseCommand } from '../../../commands/types/BaseCommand';
import { ApplicationCommandType } from 'discord-api-types/v9';
import type { ContextMenuInteraction } from 'discord.js';
import { schema, UserCommandOptions } from './options';
import { removeKeys } from 'ghoststools';

export class UserCommand extends BaseCommand<
    UserCommandOptions,
    ContextMenuInteraction
> {
    constructor(
        run: BaseCommand<UserCommandOptions, ContextMenuInteraction>['run'],
        options: UserCommandOptions,
    ) {
        super(run, { options, schema });
    }

    get applicationCommandData() {
        return {
            name: this.options.name,
            type: ApplicationCommandType.User,
            description: '',
            default_member_permissions: this.applicationCommandPermissions,
        };
    }
}

export const userCommand = (
    options: UserCommandOptions & {
        run: BaseCommandCallback<ContextMenuInteraction>;
    },
) => {
    return new UserCommand(
        options.run,
        removeKeys(options, 'run') as UserCommandOptions,
    );
};
