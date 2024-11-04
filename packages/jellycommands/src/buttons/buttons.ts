import { type ButtonOptions, buttonSchema } from './options';
import { Feature, isFeature } from '../features/features';
import type { JellyCommands } from '../JellyCommands';
import type { ButtonInteraction } from 'discord.js';
import type { MaybePromise } from '../utils/types';
import { BUTTONS_FEATURE_ID } from './plugin';
import { parseSchema } from '../utils/zod';

export type ButtonCallback = (context: {
    client: JellyCommands;
    props: Props;
    interaction: ButtonInteraction;
}) => MaybePromise<void | any>;

export class Button extends Feature<ButtonOptions> {
    public readonly options: ButtonOptions;

    constructor(
        _options: ButtonOptions,
        public readonly run: ButtonCallback,
    ) {
        super(BUTTONS_FEATURE_ID, 'Button');
        this.options = parseSchema('button', buttonSchema, _options);
    }

    static is(item: any): item is Button {
        return isFeature(item) && item.id === BUTTONS_FEATURE_ID;
    }
}

export const button = (options: ButtonOptions & { run: ButtonCallback }) => {
    const { run, ...rest } = options;
    return new Button(rest, run);
};
