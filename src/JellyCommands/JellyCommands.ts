import CommandManager from './managers/CommandManager';
import EventManager from './managers/EventManager';
import { defaults, schema } from './options';
import { MessageEmbed } from 'discord.js';

import type { JellyCommandsOptions, FullJellyCommandsOptions } from './options';
import type { Client, MessageOptions, MessageEmbedOptions } from 'discord.js';
import type { JellyCommandsOptionsMessage } from './options';

export class JellyCommands {
    public readonly client: Client;
    public readonly options: FullJellyCommandsOptions;

    private eventManager: EventManager;
    private commandManager: CommandManager;

    constructor(client: Client, options: JellyCommandsOptions = {}) {
        if (!client)
            throw new SyntaxError(
                'Expected a instance of Discord.Client, recieved none',
            );

        this.client = client;

        const { error, value } = schema.validate(
            Object.assign(defaults, options),
        );

        if (error) throw error.annotate();

        const opt: FullJellyCommandsOptions = value;

        for (const [key, value] of Object.entries(opt.messages)) {
            if (typeof value == 'object') {
                // @ts-ignore
                opt.messages[key] = {
                    ...(value as object),
                    ...opt.baseEmbed,
                };
            }
        }

        this.options = opt;

        this.eventManager = new EventManager(this);
        this.commandManager = new CommandManager(this);
    }

    static resolveMessageObject(
        item: JellyCommandsOptionsMessage,
    ): MessageOptions {
        if (typeof item == 'string') return { content: item };
        if (item instanceof MessageEmbed) return { embed: item };
        return { embed: item as MessageEmbedOptions };
    }

    get events() {
        return this.eventManager;
    }

    get commands() {
        return this.commandManager;
    }
}
