import { ApplicationCommandType } from '../../../types/applicationCommands.d';
import { schema, UserCommandOptions } from './options';
import { BaseCommand } from '../BaseCommand';
import { removeKeys } from 'ghoststools';

export class UserCommand extends BaseCommand<UserCommandOptions> {
    constructor(
        name: string,
        run: BaseCommand<UserCommandOptions>['run'],
        options: UserCommandOptions,
    ) {
        super(name, run, { options, schema });
    }

    get applicationCommandData() {
        const default_permission = this.options.guards
            ? this.options.guards.mode == 'blacklist'
            : true;

        return {
            name: this.name,
            type: ApplicationCommandType.USER,
            description: '',
            default_permission,
        };
    }
}

export const userCommand = (
    name: string,
    options: UserCommandOptions & {
        run: BaseCommand<UserCommandOptions>['run'];
    },
) => {
    return new UserCommand(
        name,
        options.run,
        removeKeys(options, 'run') as UserCommandOptions,
    );
};
