import CommandManager from './managers/CommandManager';
import EventManager from './managers/EventManager';
import { defaults, schema } from './options';

import type { Client } from 'discord.js';

export class JellyCommands {
    public readonly client: Client;
    public readonly options: typeof defaults;

    private eventManager: EventManager;
    private commandManager: CommandManager;

    constructor(client: Client, options: Partial<typeof defaults> = {}) {
        if (!client)
            throw new SyntaxError(
                'Expected a instance of Discord.Client, recieved none',
            );

        this.client = client;

        const { error, value } = schema.validate(
            Object.assign(defaults, options),
        );

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
