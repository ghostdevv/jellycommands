import { schema, SlashCommandOptions } from './options';
import { removeKeys } from 'ghoststools';
import { Message } from 'discord.js';

import type { Client, CommandInteraction } from 'discord.js';
import type { JellyCommands } from '../JellyCommands';

export class SlashCommand {
    public readonly name;
    public readonly run;
    public readonly options: SlashCommandOptions;

    constructor(
        name: string,
        run: ({}: {
            interaction: CommandInteraction;
            jelly: JellyCommands;
            client: Client;
        }) => void | any,
        options: SlashCommandOptions,
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

export const createSlashCommand = (
    name: string,
    options: SlashCommandOptions & {
        run: SlashCommand['run'];
    },
) => {
    return new SlashCommand(
        name,
        options.run,
        removeKeys(options, 'run') as SlashCommandOptions,
    );
};
