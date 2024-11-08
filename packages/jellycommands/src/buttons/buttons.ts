import { Component, isComponent } from '../components/components';
import { type ButtonOptions, buttonSchema } from './options';
import type { JellyCommands } from '../JellyCommands';
import type { ButtonInteraction } from 'discord.js';
import type { MaybePromise } from '../utils/types';
import { BUTTONS_COMPONENT_ID } from './plugin';
import { parseSchema } from '../utils/zod';

export type ButtonCallback = (context: {
    client: JellyCommands;
    props: Props;
    interaction: ButtonInteraction;
}) => MaybePromise<void | any>;

export class Button extends Component<ButtonOptions> {
    public readonly options: ButtonOptions;

    constructor(
        _options: ButtonOptions,
        public readonly run: ButtonCallback,
    ) {
        super(BUTTONS_COMPONENT_ID, 'Button');
        this.options = parseSchema('button', buttonSchema, _options);
    }

    static is(item: any): item is Button {
        return isComponent(item) && item.id === BUTTONS_COMPONENT_ID;
    }
}

export const button = (options: ButtonOptions & { run: ButtonCallback }) => {
    const { run, ...rest } = options;
    return new Button(rest, run);
};
