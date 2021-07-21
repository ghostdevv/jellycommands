import { Message, Client, ClientEvents } from 'discord.js';

declare const defaults$2: {
    ignoreBots: boolean;
    prefix: string;
};
declare type JellyCommandsOptions = Partial<typeof defaults$2>;

declare abstract class BaseManager<ManagerTarget> {
    constructor();
    protected abstract add(item: ManagerTarget, path: string): void;
    load(path: string): Promise<ManagerTarget[]> | Promise<ManagerTarget>;
    loadFile(path: string): Promise<ManagerTarget>;
    loadDirectory(path: string): Promise<ManagerTarget[]>;
}

declare const defaults$1: {
    disabled: boolean;
    allowDM: boolean;
};
declare type CommandOptions = Partial<typeof defaults$1>;

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

declare class CommandManager extends BaseManager<Command> {
    private client;
    private jelly;
    private commands;
    private loadedPaths;
    constructor(jelly: JellyCommands);
    private onMessage;
    protected add(command: Command, path: string): void;
}

declare const defaults: {
    disabled: boolean;
    once: boolean;
};
declare type EventOptions = Partial<typeof defaults>;

declare class Event {
    readonly name: keyof ClientEvents;
    readonly run: Function;
    readonly options: Required<EventOptions>;
    constructor(name: keyof ClientEvents, run: Function, options: EventOptions);
}
declare const createEvent: <K extends keyof ClientEvents>(name: K, options: Partial<{
    disabled: boolean;
    once: boolean;
}> & {
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

declare class JellyCommands {
    readonly client: Client;
    readonly options: Required<JellyCommandsOptions>;
    private eventManager;
    private commandManager;
    constructor(client: Client, options?: JellyCommandsOptions);
    get events(): EventManager;
    get commands(): CommandManager;
}

export { CommandOptions, EventOptions, JellyCommands, JellyCommandsOptions, createCommand, createEvent };
