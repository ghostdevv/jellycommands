import { ApplicationCommandType } from '../../../../types/applicationCommands.d';
import { schema, MessageCommandOptions } from './options';
import { BaseCommand } from '../../base/BaseCommand';
import { removeKeys } from 'ghoststools';

export class MessageCommand extends BaseCommand<MessageCommandOptions> {
    constructor(
        run: BaseCommand<MessageCommandOptions>['run'],
        options: MessageCommandOptions,
    ) {
        super(run, { options, schema });
    }

    get applicationCommandData() {
        const default_permission = this.options.guards
            ? this.options.guards.mode == 'blacklist'
            : true;

        return {
            name: this.options.name,
            type: ApplicationCommandType.MESSAGE,
            description: '',
            default_permission,
        };
    }
}

export const messageCommand = (
    options: MessageCommandOptions & {
        run: BaseCommand<MessageCommandOptions>['run'];
    },
) => {
    return new MessageCommand(
        options.run,
        removeKeys(options, 'run') as MessageCommandOptions,
    );
};
