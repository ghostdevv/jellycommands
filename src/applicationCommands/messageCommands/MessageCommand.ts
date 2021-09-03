import { schema, MessageCommandOptions } from './options';
import { BaseCommand } from '../BaseCommand';
import { removeKeys } from 'ghoststools';

export class MessageCommand extends BaseCommand {
    public readonly name;
    public readonly run;
    public readonly options: MessageCommandOptions;

    constructor(
        name: string,
        run: BaseCommand['run'],
        options: MessageCommandOptions,
    ) {
        super();

        this.name = name;

        if (!name || typeof name != 'string')
            throw new TypeError(
                `Expected type string for name, recieved ${typeof name}`,
            );

        this.run = run;

        if (!run || typeof run != 'function')
            throw new TypeError(
                `Expected type function for run, recieved ${typeof run}`,
            );

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
            type: 3,
            description: '',
            default_permission,
        };
    }
}

export const messageCommand = (
    name: string,
    options: MessageCommandOptions & {
        run: BaseCommand['run'];
    },
) => {
    return new MessageCommand(
        name,
        options.run,
        removeKeys(options, 'run') as MessageCommandOptions,
    );
};
