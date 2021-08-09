import CommandManager from './managers/CommandManager';
import EventManager from './managers/EventManager';
import SlashManager from './managers/SlashManager';
import { Client } from 'discord.js';
import { schema } from './options';

import type {
    JellyCommandsOptions,
    FullJellyCommandsOptions,
} from './options.d';

export class JellyCommands {
    public readonly client: Client;
    public readonly options: FullJellyCommandsOptions;

    public readonly events: EventManager;
    public readonly commands: CommandManager;
    public readonly slashCommands: SlashManager;

    constructor(client: Client, options: JellyCommandsOptions = {}) {
        if (!client || !(client instanceof Client))
            throw new SyntaxError(
                `Expected a instance of Discord.Client, recieved ${typeof client}`,
            );

        this.client = client;

        const { error, value } = schema.validate(options);

        if (error) throw error.annotate();
        else this.options = value;

        this.events = new EventManager(this);
        this.commands = new CommandManager(this);
        this.slashCommands = new SlashManager(this);
    }
}
