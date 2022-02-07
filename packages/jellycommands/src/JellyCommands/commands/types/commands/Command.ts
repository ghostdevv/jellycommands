import type { APIApplicationCommandOption } from 'discord-api-types/v9';
import type { ApplicationCommandOptionData } from 'discord.js';
import { ApplicationCommandType } from 'discord-api-types/v9';
import type { CommandInteraction } from 'discord.js';
import { BaseCommand } from '../../base/BaseCommand';
import { schema, CommandOptions } from './options';
import { ApplicationCommand } from 'discord.js';
import { removeKeys } from 'ghoststools';

export class Command extends BaseCommand<CommandOptions, CommandInteraction> {
    constructor(
        run: BaseCommand<CommandOptions, CommandInteraction>['run'],
        options: CommandOptions,
    ) {
        super(run, { options, schema });
    }

    static transformOption(option: ApplicationCommandOptionData) {
        const transform =
            ApplicationCommand['transformOption'].bind(ApplicationCommand);

        const result = transform(option, false) as APIApplicationCommandOption;

        return result;

        // Below is the alternative implementation

        // const type: number =
        //     typeof option.type == 'number'
        //         ? option.type
        //         : ProxyApplicationCommandOptionTypes[option.type];

        // const base: ApplicationCommandOptionData = {
        //     ...option,
        //     type,
        // };

        // // SUB_COMMAND || SUB_COMMAND_GROUP
        // if (type == 1 || type == 2) {
        //     // @ts-ignore
        //     const options = option.options?.map((o) =>
        //         Command.transformOption(o),
        //     );

        //     return {
        //         ...base,
        //         // @ts-ignore
        //         options,
        //     };
        // }

        // return base;
    }

    get applicationCommandData() {
        const default_permission = this.options.guards
            ? this.options.guards.mode == 'blacklist'
            : true;

        const options = this.options.options?.map((o) =>
            Command.transformOption(o),
        );

        return {
            name: this.options.name,
            type: ApplicationCommandType.ChatInput,
            description: this.options.description,
            default_permission,
            options,
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
