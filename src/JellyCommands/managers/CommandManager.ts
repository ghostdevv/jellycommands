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

        /**
         * Check if the command exists, if it doesn't and there is a unkownCommand embed it sends it
         */
        if (!command || command.options.disabled)
            return (
                messages.unknownCommand &&
                message.channel.send(messages.unknownCommand)
            );

        /**
         * Check the user has the permissions to use the command
         */
        const permissionCheck = command.permissionCheck(message);
        if (!permissionCheck) return;

        /**
         * Check that the command is able to be ran
         */
        const contextCheck = command.contextCheck(message);

        /**
         * Run the command if it passed the context check
         */
        if (contextCheck)
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
