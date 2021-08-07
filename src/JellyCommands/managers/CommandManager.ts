import { JellyCommands } from '../JellyCommands';
import { Command } from '../commands/Command';
import BaseManager from './BaseManager';

import type { Client, Message } from 'discord.js';

export default class CommandManager extends BaseManager<Command> {
    private client: Client;
    private jelly: JellyCommands;

    private commands = new Map<string, Command>();
    private loadedPaths = new Set<string>();

    constructor(jelly: JellyCommands) {
        super();

        this.jelly = jelly;
        this.client = jelly.client;

        this.client.on('messageCreate', (m) => this.onMessage(m));
    }

    private onMessage(message: Message): any {
        const { prefix, messages } = this.jelly.options;

        if (!message.content.startsWith(prefix)) return;

        const commandWord = message.content
            .slice(prefix.length)
            .split(' ')[0]
            .trim();

        if (commandWord.length == 0) return;

        const command = this.commands.get(commandWord);

        if (!command)
            return (
                messages.unknownCommand &&
                message.channel.send(messages.unknownCommand)
            );

        const { allowedUsers, blockedUsers } = command.options.guards;

        if (allowedUsers && !allowedUsers.includes(message.author.id)) return;
        if (blockedUsers && blockedUsers.includes(message.author.id)) return;

        const check = command.check(message);

        if (check)
            command.run({
                message,
                jelly: this.jelly,
                client: this.client,
            });
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

        this.commands.set(command.name, command);
    }
}
