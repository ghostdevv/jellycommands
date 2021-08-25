import { Command } from '../commands/Command';
import { JellyCommands } from '../JellyCommands';
import BaseManager from './BaseManager';

import type {
    GuildApplicationCommandPermissionData,
    ApplicationCommandPermissionData,
    ApplicationCommandData,
    CommandInteraction,
    Client,
} from 'discord.js';

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
        const defaultPermission =
            command.options?.guards &&
            command.options?.guards.mode == 'blacklist';

        return {
            name: command.name,
            description: command.options.description,
            options: command.options.options,
            defaultPermission,
        };
    }

    private resolveApplicationCommandPermissions(
        command: Command,
    ): ApplicationCommandPermissionData[] | null {
        if (!command.options.guards) return null;

        const { mode, users, roles } = command.options.guards;

        const permissions: ApplicationCommandPermissionData[][] = [];
        const permission = mode == 'whitelist';

        if (users)
            permissions.push(
                users.map((id) => ({ id, type: 'USER', permission })),
            );

        if (roles)
            permissions.push(
                roles.map((id) => ({ id, type: 'ROLE', permission })),
            );

        return permissions.flat();
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
            const resolvedGuild = await this.client.guilds.fetch(guild);
            const setCommands = new Map<string, Command>();

            /**
             * Clear guild commands
             */
            await resolvedGuild.commands.set([]);

            /**
             * Set guild commands
             */
            for (const command of commands) {
                const data = this.resolveApplicationCommandData(command);
                const res = await resolvedGuild.commands.create(data);

                setCommands.set(res.id, command);
            }

            /**
             * Set permissions
             */
            const fullPermissions: GuildApplicationCommandPermissionData[] = [];

            for (const [id, command] of setCommands) {
                const permissions =
                    this.resolveApplicationCommandPermissions(command);

                if (permissions)
                    fullPermissions.push({
                        id,
                        permissions,
                    });
            }

            await resolvedGuild.commands.permissions.set({ fullPermissions });
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
