import { ApplicationCommandType } from '../../../../types/applicationCommands.d';
import { schema, CommandOptions } from './options';
import { BaseCommand } from '../../BaseCommand';
import { removeKeys } from 'ghoststools';

export class Command extends BaseCommand<CommandOptions> {
    constructor(
        run: BaseCommand<CommandOptions>['run'],
        options: CommandOptions,
    ) {
        super(run, { options, schema });
    }

    get applicationCommandData() {
        const default_permission = this.options.guards
            ? this.options.guards.mode == 'blacklist'
            : true;

        return {
            name: this.options.name,
            type: ApplicationCommandType.CHAT_INPUT,
            description: this.options.description,
            options: this.options.options,
            default_permission,
        };
    }
}

export const command = (
    options: CommandOptions & {
        run: BaseCommand<CommandOptions>['run'];
    },
) => {
    return new Command(
        options.run,
        removeKeys(options, 'run') as CommandOptions,
    );
};
