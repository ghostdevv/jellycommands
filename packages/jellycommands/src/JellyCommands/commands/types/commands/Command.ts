import type { APIApplicationCommandOption } from 'discord-api-types/v9';
import { APIApplicationCommandBasicOption } from 'discord-api-types/v9';
import type { ApplicationCommandOptionData } from 'discord.js';
import { ApplicationCommandType } from 'discord-api-types/v9';
import { BaseCommand } from '../../base/BaseCommand';
import type { CommandInteraction } from 'discord.js';
import { schema, CommandOptions } from './options';
import { removeKeys } from 'ghoststools';

enum ProxyApplicationCommandOptionTypes {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP = 2,
    STRING = 3,
    INTEGER = 4,
    BOOLEAN = 5,
    USER = 6,
    CHANNEL = 7,
    ROLE = 8,
    MENTIONABLE = 9,
    NUMBER = 10,
}

export class Command extends BaseCommand<CommandOptions, CommandInteraction> {
    constructor(
        run: BaseCommand<CommandOptions, CommandInteraction>['run'],
        options: CommandOptions,
    ) {
        super(run, { options, schema });
    }

    static transformOption(option: ApplicationCommandOptionData) {
        const type: number =
            typeof option.type == 'number'
                ? option.type
                : ProxyApplicationCommandOptionTypes[option.type];

        const base: APIApplicationCommandBasicOption = {
            type,
            name: option.name,
            description: option.description,
        };

        // if (option.type == 'SUB_COMMAND' || option.type == 'SUB_COMMAND_GROUP')
        //     data.options = option.options?.map(o => Command.transformOption(o))
    }

    // @ts-ignore
    get applicationCommandData() {
        const default_permission = this.options.guards
            ? this.options.guards.mode == 'blacklist'
            : true;

        // This needs to be transformed to the correct typings
        const options = this.options.options;

        if (options) Command.transformOption(options[0]);

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
