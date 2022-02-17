import type { BaseCommandCallback } from '../../base/BaseCommand';
import { ApplicationCommandType } from 'discord-api-types/v9';
import type { ContextMenuInteraction } from 'discord.js';
import { schema, UserCommandOptions } from './options';
import { BaseCommand } from '../../base/BaseCommand';
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
        const default_permission = this.options.guards
            ? this.options.guards.mode == 'blacklist'
            : true;

        return {
            name: this.options.name,
            type: ApplicationCommandType.User,
            description: '',
            default_permission,
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
