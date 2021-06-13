import { defaults, JellyCommandsOptions } from './options/JellyCommands';
import { EventManager } from './events/EventManager';
import { merge } from './util/options';
import { Client } from 'discord.js';

export class JellyCommands {
    #client: Client;
    #options: JellyCommandsOptions;

    private eventManager: EventManager;

    constructor(client: Client, options: JellyCommandsOptions = {}) {
        if (!client)
            throw new SyntaxError(
                'Expected a instance of Discord.Client, recieved none',
            );

        this.#client = client;
        this.#options = merge<JellyCommandsOptions>(defaults, options);

        this.eventManager = new EventManager(this);
    }

    get client() {
        return this.#client;
    }

    get options() {
        return Object.freeze({ ...this.#options });
    }

    get events() {
        return this.eventManager;
    }
}
