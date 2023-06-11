import { type ButtonOptions, schema } from './options';
import type { JellyCommands } from '../JellyCommands';
import type { ButtonInteraction } from 'discord.js';
import { BaseFeature } from '../features/features';
import type { Awaitable } from '../utils/types';

export type ButtonCallback = (context: {
    client: JellyCommands;
    props: Props;
    interaction: ButtonInteraction;
}) => Awaitable<void | any>;

export class Button extends BaseFeature {
    public readonly options: ButtonOptions;
    public readonly TYPE = 'BUTTON' as const;

    constructor(options: ButtonOptions, public readonly run: ButtonCallback) {
        super();

        const { error, value } = schema.validate(options);

        if (error) throw error.annotate();
        else this.options = value;
    }
}

export const button = (options: ButtonOptions & { run: ButtonCallback }) => {
    const { run, ...rest } = options;
    return new Button(rest, run);
};
