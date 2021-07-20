import BaseManager from './BaseManager';
import { Command } from '../commands/Command';

import type { JellyCommands } from '../JellyCommands';
import type { Client } from 'discord.js';

export default class CommandManager extends BaseManager<Command> {
    private client: Client;
    private jelly: JellyCommands;

    private loadedPaths = new Set<string>();

    constructor(jelly: JellyCommands) {
        super();

        this.jelly = jelly;
        this.client = jelly.client;
    }

    protected add(command: Command, path: string) {
        if (this.loadedPaths.has(path))
            throw new Error(
                `The path ${path} has already been loaded, therefore can not be loaded again`,
            );

        this.loadedPaths.add(path);

        if (!(command instanceof Command))
            throw new Error(
                `Expected instance of Command, recieved ${typeof command}`,
            );

        if (command.options.disabled) return;
    }
}
