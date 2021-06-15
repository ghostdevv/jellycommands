<<<<<<< HEAD:src/core/JellyCommands.ts
import { EventManager } from '../events/EventManager';
import { defaults, schema } from './options';

import type { JellyCommandsOptions } from './options';
import type { Client } from 'discord.js';
=======
import { defaults, JellyCommandsOptions, schema } from './options';
import { EventManager } from './events/EventManager';
import { Client } from 'discord.js';
>>>>>>> parent of 9b26d3d (feat: export for cjs and esm):src/JellyCommands.ts

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

        const { error, value } = schema.validate(
            Object.assign(defaults, options),
        );

        if (error) throw error.annotate();
        else this.#options = value;

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
