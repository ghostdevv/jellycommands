import EventManager from './managers/EventManager';
import CommandManager from './managers/CommandManager';
import { Client } from 'discord.js';
import { schema } from './options';

import type {
    JellyCommandsOptions,
    FullJellyCommandsOptions,
} from './options.d';

export class JellyCommands {
    public readonly client: Client;
    public readonly options: FullJellyCommandsOptions;

    private readonly eventManager: EventManager;
    private readonly commandManager: CommandManager;

    constructor(client: Client, options: JellyCommandsOptions = {}) {
        if (!client || !(client instanceof Client))
            throw new SyntaxError(
                `Expected a instance of Discord.Client, recieved ${typeof client}`,
            );

        this.client = client;

        const { error, value } = schema.validate(options);

        if (error) throw error.annotate();
        else this.options = value;

        this.eventManager = new EventManager(this);
        this.commandManager = new CommandManager(this);
    }

    get events() {
        return this.eventManager;
    }

    get commands() {
        return this.commandManager;
    }
}
