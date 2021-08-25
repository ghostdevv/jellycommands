import { schema, CommandOptions } from './options';
import { removeKeys } from 'ghoststools';
import { Message } from 'discord.js';

import type { Client, CommandInteraction } from 'discord.js';
import type { JellyCommands } from '../JellyCommands';

export class Command {
    public readonly name;
    public readonly run;
    public readonly options: CommandOptions;

    constructor(
        name: string,
        run: ({}: {
            interaction: CommandInteraction;
            jelly: JellyCommands;
            client: Client;
        }) => void | any,
        options: CommandOptions,
    ) {
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
    }
}

export const createCommand = (
    name: string,
    options: CommandOptions & {
        run: Command['run'];
    },
) => {
    return new Command(
        name,
        options.run,
        removeKeys(options, 'run') as CommandOptions,
    );
};
