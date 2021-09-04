import { schema, CommandOptions } from './options';
import { BaseCommand } from '../BaseCommand';
import { removeKeys } from 'ghoststools';

export class Command extends BaseCommand<CommandOptions> {
    constructor(
        name: string,
        run: BaseCommand<CommandOptions>['run'],
        options: CommandOptions,
    ) {
        super(name, run, { options, schema });
    }

    get applicationCommandData() {
        const default_permission = this.options.guards
            ? this.options.guards.mode == 'blacklist'
            : true;

        return {
            name: this.name,
            type: 1,
            description: this.options.description,
            options: this.options.options,
            default_permission,
        };
    }
}

export const command = (
    name: string,
    options: CommandOptions & {
        run: BaseCommand<CommandOptions>['run'];
    },
) => {
    return new Command(
        name,
        options.run,
        removeKeys(options, 'run') as CommandOptions,
    );
};
