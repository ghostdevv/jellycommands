import { Client } from 'discord.js';
import defaultOptions from '../options.default';

export class JellyCommands {
    private client: Client;
    private options: typeof defaultOptions;

    constructor(client: Client, options: typeof defaultOptions) {
        this.client = client;
        this.options = Object.assign(defaultOptions, options);

        if (!client)
            throw new SyntaxError(
                'Expected a instance of Discord.Client, recieved none',
            );

        if (client instanceof Client)
            throw new TypeError(
                `Expected a instance of Discord.Client, recieved ${typeof client}`,
            );
    }
}
