import { defaults, schema } from './options';
import { removeKeys } from 'ghoststools';

export class Command {
    public readonly name: string;
    public readonly run: Function;
    public readonly options: typeof defaults;

    constructor(
        name: string,
        run: Function,
        options: Partial<typeof defaults>,
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

        const { error, value } = schema.validate(
            Object.assign(defaults, options),
        );

        if (error) throw error.annotate();
        else this.options = value;
    }
}

export const createCommand = (
    name: string,
    options: Partial<typeof defaults> & { run: () => void | any },
) => {
    return new Command(name, options.run, removeKeys(options, 'run'));
};
