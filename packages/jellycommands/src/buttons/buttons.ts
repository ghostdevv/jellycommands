import { type ButtonOptions, buttonSchema } from './options';
import type { JellyCommands } from '../JellyCommands';
import type { ButtonInteraction } from 'discord.js';
import type { MaybePromise } from '../utils/types';
import { BaseFeature } from '../features/features';
import { parseSchema } from '../utils/zod';

export type ButtonCallback = (context: {
    client: JellyCommands;
    props: Props;
    interaction: ButtonInteraction;
}) => MaybePromise<void | any>;

export class Button extends BaseFeature {
    public readonly options: ButtonOptions;
    public readonly TYPE = 'BUTTON' as const;

    constructor(
        options: ButtonOptions,
        public readonly run: ButtonCallback,
    ) {
        super();
        this.options = parseSchema('button', buttonSchema, options);
    }
}

export const button = (options: ButtonOptions & { run: ButtonCallback }) => {
    const { run, ...rest } = options;
    return new Button(rest, run);
};
