import CommandManager from './managers/CommandManager';
import EventManager from './managers/EventManager';
import { defaults, schema } from './options';
import { Client } from 'discord.js';

import type { JellyCommandsOptions, FullJellyCommandsOptions } from './options';

export class JellyCommands {
    public readonly client: Client;
    public readonly options: FullJellyCommandsOptions;

    public readonly events: EventManager;
    public readonly commands: CommandManager;

    constructor(client: Client, options: JellyCommandsOptions = {}) {
        if (!client || !(client instanceof Client))
            throw new SyntaxError(
                `Expected a instance of Discord.Client, recieved ${typeof client}`,
            );

        this.client = client;

        const { error, value } = schema.validate(
            Object.assign(defaults, options),
        );

        if (error) throw error.annotate();
        else this.options = value;

        this.events = new EventManager(this);
        this.commands = new CommandManager(this);
    }
}
