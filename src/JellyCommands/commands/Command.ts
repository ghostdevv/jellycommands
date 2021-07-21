import { defaults, schema, CommandOptions } from './options';
import { removeKeys } from 'ghoststools';
import { Message } from 'discord.js';

export class Command {
    public readonly name: string;
    public readonly run: Function;
    public readonly options: Required<CommandOptions>;

    constructor(name: string, run: Function, options: CommandOptions) {
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

        const { error, value } = schema.validate(
            Object.assign(defaults, options),
        );

        if (error) throw error.annotate();
        else this.options = value;
    }

    public check(message: Message): boolean {
        if (!message || !(message instanceof Message))
            throw new TypeError(
                `Expected type Message, recieved ${typeof message}`,
            );

        const opt = this.options;

        if (opt.disabled) return false;
        if (opt.allowDM === false && message.channel.type == 'dm') return false;

        return true;
    }
}

export const createCommand = (
    name: string,
    options: CommandOptions & { run: () => void | any },
) => {
    return new Command(name, options.run, removeKeys(options, 'run'));
};
