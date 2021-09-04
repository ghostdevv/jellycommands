import { ApplicationCommandType } from '../../../types/applicationCommands.d';
import { schema, MessageCommandOptions } from './options';
import { BaseCommand } from '../BaseCommand';
import { removeKeys } from 'ghoststools';

export class MessageCommand extends BaseCommand<MessageCommandOptions> {
    constructor(
        name: string,
        run: BaseCommand<MessageCommandOptions>['run'],
        options: MessageCommandOptions,
    ) {
        super(name, run, { options, schema });
    }

    get applicationCommandData() {
        const default_permission = this.options.guards
            ? this.options.guards.mode == 'blacklist'
            : true;

        return {
            name: this.name,
            type: ApplicationCommandType.MESSAGE,
            description: '',
            default_permission,
        };
    }
}

export const messageCommand = (
    name: string,
    options: MessageCommandOptions & {
        run: BaseCommand<MessageCommandOptions>['run'];
    },
) => {
    return new MessageCommand(
        name,
        options.run,
        removeKeys(options, 'run') as MessageCommandOptions,
    );
};
