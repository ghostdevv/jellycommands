import { type ButtonOptions, buttonSchema } from './options';
import type { JellyCommands } from '../JellyCommands';
import type { ButtonInteraction } from 'discord.js';
import type { Awaitable } from '../utils/types';
import { parseSchema } from '../utils/zod';

export type ButtonCallback = (context: {
    client: JellyCommands;
    props: Props;
    interaction: ButtonInteraction;
}) => Awaitable<void | any>;

export class Button {
    public readonly options: ButtonOptions;

    constructor(
        options: ButtonOptions,
        public readonly run: ButtonCallback,
    ) {
        this.options = parseSchema('button', buttonSchema, options);
    }
}

export const button = (options: ButtonOptions & { run: ButtonCallback }) => {
    const { run, ...rest } = options;
    return new Button(rest, run);
};
