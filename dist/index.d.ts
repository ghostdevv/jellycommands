import { Message, Client, ClientEvents, MessagePayload, MessageOptions } from 'discord.js';

interface CommandOptions {
    disabled: boolean;
    allowDM: boolean;
}

declare class Command {
    readonly name: string;
    readonly run: ({}: {
        message: Message;
        jelly: JellyCommands;
        client: Client;
    }) => void | any;
    readonly options: Required<CommandOptions>;
    constructor(name: string, run: ({}: {
        message: Message;
        jelly: JellyCommands;
        client: Client;
    }) => void | any, options: CommandOptions);
    check(message: Message): boolean;
}
declare const createCommand: (name: string, options: CommandOptions & {
    run: Command['run'];
}) => Command;

declare abstract class BaseManager<ManagerTarget> {
    constructor();
    protected abstract add(item: ManagerTarget, path: string): void;
    load(path: string): Promise<ManagerTarget[]> | Promise<ManagerTarget>;
    loadFile(path: string): Promise<ManagerTarget>;
    loadDirectory(path: string): Promise<ManagerTarget[]>;
}

declare class CommandManager extends BaseManager<Command> {
    private client;
    private jelly;
    private commands;
    private loadedPaths;
    constructor(jelly: JellyCommands);
    private onMessage;
    protected add(command: Command, path: string): void;
}

interface EventOptions {
    disabled: boolean;
    once: boolean;
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

interface JellyCommandsOptions {
    ignoreBots?: boolean;
    prefix?: string;

    guards?: {};

    messages?: {
        unknownCommand: undefined | (string | MessagePayload | MessageOptions);
    };
}

interface FullJellyCommandsOptions {
    ignoreBots: boolean;
    prefix: string;

    guards: {};

    messages: {
        unknownCommand: undefined | (string | MessagePayload | MessageOptions);
    };
}

declare class JellyCommands {
    readonly client: Client;
    readonly options: FullJellyCommandsOptions;
    readonly events: EventManager;
    readonly commands: CommandManager;
    constructor(client: Client, options?: JellyCommandsOptions);
}

export { Command, CommandOptions, Event, EventOptions, FullJellyCommandsOptions, JellyCommands, JellyCommandsOptions, createCommand, createEvent };
