import { Client } from 'discord.js';
import defaultOptions from '../options.default';

export class JellyCommands {
    private client: Client;
    private options: typeof defaultOptions;

    constructor(client: Client, options: typeof defaultOptions) {
        this.client = client;
        this.options = Object.assign(defaultOptions, options);

        if (client instanceof Client) throw new TypeError('Expected a instance of Discord.Client');
    }
}