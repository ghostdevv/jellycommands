import type { APIApplicationCommandOption } from 'discord-api-types/v9';
import { ApplicationCommandOptionType } from 'discord-api-types/v9';
import type { ApplicationCommandOptionData } from 'discord.js';
import { ApplicationCommandType } from 'discord-api-types/v9';
import { BaseCommand } from '../../base/BaseCommand';
import type { CommandInteraction } from 'discord.js';
import { schema, CommandOptions } from './options';
import { removeKeys } from 'ghoststools';

export class Command extends BaseCommand<CommandOptions, CommandInteraction> {
    constructor(
        run: BaseCommand<CommandOptions, CommandInteraction>['run'],
        options: CommandOptions,
    ) {
        super(run, { options, schema });
    }

    static transformCommandOption(option: ApplicationCommandOptionData) {
        const type =
            typeof option.type == 'number'
                ? option.type
                : ApplicationCommandOptionType[option.type];

        option.type;

        // return {
        //     ...command,
        //     type,
        // };
    }

    // @ts-ignore
    get applicationCommandData() {
        const default_permission = this.options.guards
            ? this.options.guards.mode == 'blacklist'
            : true;

        // This needs to be transformed to the correct typings
        const options = this.options.options;

        return {
            name: this.options.name,
            type: ApplicationCommandType.ChatInput,
            description: this.options.description,
            options: this.options.options,
            default_permission,
        };
    }
}

export const command = (
    options: CommandOptions & {
        run: BaseCommand<CommandOptions, CommandInteraction>['run'];
    },
) => {
    return new Command(
        options.run,
        removeKeys(options, 'run') as CommandOptions,
    );
};
