import { ClientEvents, Client, ApplicationCommandOptionData, InteractionDeferReplyOptions, CommandInteraction, MessagePayload, MessageOptions } from 'discord.js';

declare abstract class BaseManager<ManagerTarget> {
    constructor();
    protected abstract add(item: ManagerTarget, path: string): void;
    load(path: string): Promise<ManagerTarget[]> | Promise<ManagerTarget>;
    loadFile(path: string): Promise<ManagerTarget>;
    loadDirectory(path: string): Promise<ManagerTarget[]>;
}

interface EventOptions {
    disabled?: boolean;
    once?: boolean;
}

declare class Event {
    readonly name: keyof ClientEvents;
    readonly run: Function;
    readonly options: Required<EventOptions>;
    constructor(name: keyof ClientEvents, run: Function, options: EventOptions);
}
declare const createEvent: <K extends keyof ClientEvents>(name: K, options: EventOptions & {
    run: (instance: {
        client: Client;
        jelly: JellyCommands;
    }, ...args: ClientEvents[K]) => void | any;
}) => Event;

declare class EventManager extends BaseManager<Event> {
    private client;
    private jelly;
    private loadedPaths;
    constructor(jelly: JellyCommands);
    protected add(event: Event, path: string): void;
}

interface CommandOptions {
    description: string;
    options?: ApplicationCommandOptionData[];
    defer?: boolean | InteractionDeferReplyOptions;
    defaultPermission?: boolean;
    guilds?: string[];
    global?: boolean;
    disabled?: boolean;
}

declare class Command {
    readonly name: string;
    readonly run: ({}: {
        interaction: CommandInteraction;
        jelly: JellyCommands;
        client: Client;
    }) => void | any;
    readonly options: CommandOptions;
    constructor(name: string, run: ({}: {
        interaction: CommandInteraction;
        jelly: JellyCommands;
        client: Client;
    }) => void | any, options: CommandOptions);
}
declare const createCommand: (name: string, options: CommandOptions & {
    run: Command['run'];
}) => Command;

declare class CommandManager extends BaseManager<Command> {
    private client;
    private jelly;
    private commands;
    private loadedPaths;
    private globalCommands;
    private guildCommands;
    constructor(jelly: JellyCommands);
    private onCommand;
    private resolveApplicationCommandData;
    register(): Promise<Map<string, Command>>;
    protected add(command: Command, path: string): void;
}

interface JellyCommandsOptions {
    ignoreBots?: boolean;
    prefix?: string;

    messages?: {
        unknownCommand?: string | MessagePayload | MessageOptions;
    };
}

interface FullJellyCommandsOptions {
    ignoreBots: boolean;
    prefix: string;

    messages: {
        unknownCommand?: string | MessagePayload | MessageOptions;
    };
}

declare class JellyCommands {
    readonly client: Client;
    readonly options: FullJellyCommandsOptions;
    private readonly eventManager;
    private readonly commandManager;
    constructor(client: Client, options?: JellyCommandsOptions);
    get events(): EventManager;
    get commands(): CommandManager;
}

export { Command, CommandOptions, Event, EventOptions, FullJellyCommandsOptions, JellyCommands, JellyCommandsOptions, createCommand, createEvent };
