import { Message, ClientEvents, Client } from 'discord.js';

declare abstract class BaseManager<ManagerTarget> {
    constructor();
    protected abstract add(item: ManagerTarget, path: string): void;
    load(path: string): Promise<ManagerTarget[]> | Promise<ManagerTarget>;
    loadFile(path: string): Promise<ManagerTarget>;
    loadDirectory(path: string): Promise<ManagerTarget[]>;
}

declare const defaults$2: {
    disabled: boolean;
    allowDM: boolean;
};

declare class Command {
    readonly name: string;
    readonly run: Function;
    readonly options: typeof defaults$2;
    constructor(name: string, run: Function, options: Partial<typeof defaults$2>);
    check(message: Message): boolean;
}
declare const createCommand: (name: string, options: Partial<typeof defaults$2> & {
    run: () => void | any;
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

declare const defaults$1: {
    disabled: boolean;
    once: boolean;
};

declare class Event {
    readonly name: keyof ClientEvents;
    readonly run: Function;
    readonly options: typeof defaults$1;
    constructor(name: keyof ClientEvents, run: Function, options: Partial<typeof defaults$1>);
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

declare const defaults: {
    ignoreBots: boolean;
    prefix: string;
};

declare class JellyCommands {
    readonly client: Client;
    readonly options: typeof defaults;
    private eventManager;
    private commandManager;
    constructor(client: Client, options?: Partial<typeof defaults>);
    get events(): EventManager;
    get commands(): CommandManager;
}

export { JellyCommands, createCommand, createEvent };
