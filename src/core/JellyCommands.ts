import { defaults, JellyCommandsOptions, validate } from '../options';
import { CommandManager } from './CommandManager';
import { Client } from 'discord.js';

export class JellyCommands {
    #client: Client;
    #options: JellyCommandsOptions;

    private commandManager: CommandManager;

    constructor(client: Client, options: JellyCommandsOptions) {
        const [valid, validationError] = validate(options);
        if (!valid) throw validationError;

        if (!client)
            throw new SyntaxError(
                'Expected a instance of Discord.Client, recieved none',
            );

        if (!(client instanceof Client))
            throw new TypeError(
                `Expected a instance of Discord.Client, recieved ${typeof client}`,
            );

        this.#client = client;
        this.#options = Object.assign(defaults, options);

        this.commandManager = new CommandManager();
    }

    get client() {
        return this.#client;
    }

    get options() {
        return Object.freeze({ ...this.#options });
    }
}
