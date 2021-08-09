import { schema, CommandOptions } from './options';
import { removeKeys } from 'ghoststools';
import { Message } from 'discord.js';

import type { JellyCommands } from '../JellyCommands';
import type { Client } from 'discord.js';

export class Command {
    public readonly name;
    public readonly run;
    public readonly options: Required<CommandOptions>;

    constructor(
        name: string,
        run: ({}: {
            message: Message;
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

    public permissionCheck(message: Message): boolean {
        if (!message || !(message instanceof Message))
            throw new TypeError(
                `Expected type Message, recieved ${typeof message}`,
            );

        const { allowedUsers, blockedUsers } = this.options.guards;

        /**
         * Check if there is a allowedUsers array, if so check if the user is on it
         */
        if (allowedUsers && !allowedUsers.includes(message.author.id))
            return false;

        /**
         * Check if there is a blockedUsers array, if so check if the user is on it
         */
        if (blockedUsers && blockedUsers.includes(message.author.id))
            return false;

        return true;
    }

    public contextCheck(message: Message): boolean {
        if (!message || !(message instanceof Message))
            throw new TypeError(
                `Expected type Message, recieved ${typeof message}`,
            );

        const opt = this.options;

        /**
         * If allowing DM is set to false, check fails
         */
        if (opt.allowDM === false && message.channel.type == 'DM') return false;

        return true;
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
