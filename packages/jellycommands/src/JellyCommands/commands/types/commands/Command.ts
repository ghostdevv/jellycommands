import type { APIApplicationCommandOption } from 'discord-api-types/v9';
import type { BaseCommandCallback } from '../../base/BaseCommand';
import type { ApplicationCommandOptionData } from 'discord.js';
import { ApplicationCommandType } from 'discord-api-types/v9';
import type { JellyCommands } from '../../../JellyCommands';
import type { AutocompleteInteraction } from 'discord.js';
import type { CommandInteraction } from 'discord.js';
import { BaseCommand } from '../../base/BaseCommand';
import { schema, CommandOptions } from './options';
import { ApplicationCommand } from 'discord.js';
import { removeKeys } from 'ghoststools';

type Awaitable<T> = T | Promise<T>;

export type AutocompleteHandler = ({}: {
    interaction: AutocompleteInteraction;
    client: JellyCommands;
}) => Awaitable<any | void>;

export class Command extends BaseCommand<CommandOptions, CommandInteraction> {
    readonly autocomplete?: AutocompleteHandler;

    constructor(
        run: BaseCommand<CommandOptions, CommandInteraction>['run'],
        options: CommandOptions,
        autocomplete?: AutocompleteHandler,
    ) {
        if (autocomplete && typeof autocomplete !== 'function') {
            throw new TypeError('Autocomplete handler must be a function');
        }

        super(run, { options, schema });

        this.autocomplete = autocomplete;
    }

    static transformOption(option: ApplicationCommandOptionData) {
        const transform =
            ApplicationCommand['transformOption'].bind(ApplicationCommand);

        const result = transform(option, false) as APIApplicationCommandOption;

        return result;
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
        run: BaseCommandCallback<CommandInteraction>;
        autocomplete?: AutocompleteHandler;
    },
) => {
    return new Command(
        options.run,
        removeKeys(options, ['run', 'autocomplete']) as CommandOptions,
        options.autocomplete,
    );
};
