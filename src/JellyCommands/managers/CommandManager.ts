import { Command } from '../commands/Command';
import { JellyCommands } from '../JellyCommands';
import BaseManager from './BaseManager';

import type { Client, CommandInteraction } from 'discord.js';
import type { ApplicationCommandData } from 'discord.js';

export default class CommandManager extends BaseManager<Command> {
    private client: Client;
    private jelly: JellyCommands;

    private commands = new Map<string, Command>();
    private loadedPaths = new Set<string>();

    private globalCommands = new Map<string, Command>();
    private guildCommands = new Map<string, Command[]>();

    constructor(jelly: JellyCommands) {
        super();

        this.jelly = jelly;
        this.client = jelly.client;

        this.client.on('interactionCreate', (i) => {
            i.isCommand() && this.onCommand(i);
        });
    }

    private async onCommand(interaction: CommandInteraction): Promise<any> {
        const command = this.commands.get(interaction.commandName);

        /**
         * If command is not found return - if unknownCommand message send
         */
        if (!command)
            return (
                this.jelly.options.messages?.unknownCommand &&
                interaction.reply(this.jelly.options.messages.unknownCommand)
            );

        const options = command.options;

        /**
         * If defer, defer
         */
        if (options.defer)
            await interaction.deferReply(
                typeof options.defer == 'object' ? options.defer : {},
            );

        /**
         * Run the command
         */
        command.run({
            jelly: this.jelly,
            client: this.client,
            interaction,
        });
    }

    private resolveApplicationCommandData(
        command: Command,
    ): ApplicationCommandData {
        return {
            name: command.name,
            description: command.options.description,
            options: command.options.options,
            defaultPermission: command.options.defaultPermission,
        };
    }

    public async register(): Promise<Map<string, Command>> {
        if (!this.client.isReady())
            throw new Error(
                `Client is not ready, only call register after client is ready`,
            );

        /**
         * Register the global commands
         */
        await this.client.application?.commands.set(
            [...this.globalCommands.values()].map((command) =>
                this.resolveApplicationCommandData(command),
            ),
        );

        /**
         * Register the guild commands
         */
        for (const [guild, commands] of this.guildCommands.entries()) {
            const resovledCommands = commands.map((command) =>
                this.resolveApplicationCommandData(command),
            );

            await this.client.application?.commands.set(
                resovledCommands,
                guild,
            );
        }

        return new Map<string, Command>(this.commands);
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

        /**
         * If global command add to global commands map
         */
        if (command.options.global)
            this.globalCommands.set(command.name, command);

        /**
         * Add every guild to guildCommands map
         */
        for (const guild of command.options.guilds || [])
            this.guildCommands.set(guild, [
                ...(this.guildCommands.get(guild) || []),
                command,
            ]);

        /**
         * Add to commands map
         */
        this.commands.set(command.name, command);
    }
}
