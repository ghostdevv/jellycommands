import { schema, UserCommandOptions } from './options';
import { BaseCommand } from '../BaseCommand';
import { removeKeys } from 'ghoststools';

export class UserCommand extends BaseCommand {
    public readonly options: UserCommandOptions;

    constructor(
        name: string,
        run: BaseCommand['run'],
        options: UserCommandOptions,
    ) {
        super(name, run);

        const { error, value } = schema.validate(options);

        if (error) throw error.annotate();
        else this.options = value;

        if (!this.options.guilds?.length && !this.options.global)
            throw new Error(
                'Command must have at least one of guild or global',
            );

        if (
            this.options.global &&
            !this.options.guilds?.length &&
            this.options.guards
        ) {
            throw new Error(
                'If using guards on a global command you must have a guilds array, guards can only be applied to guilds',
            );
        }
    }

    get applicationCommandData() {
        const default_permission = this.options.guards
            ? this.options.guards.mode == 'blacklist'
            : true;

        return {
            name: this.name,
            type: 2,
            description: '',
            default_permission,
        };
    }
}

export const userCommand = (
    name: string,
    options: UserCommandOptions & {
        run: BaseCommand['run'];
    },
) => {
    return new UserCommand(
        name,
        options.run,
        removeKeys(options, 'run') as UserCommandOptions,
    );
};
