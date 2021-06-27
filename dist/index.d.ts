import { ClientEvents, Client } from 'discord.js';

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

declare class EventManager {
    private client;
    private jelly;
    private loadedPaths;
    constructor(jelly: JellyCommands);
    private add;
    private addPath;
    load(path: string): Promise<Event[]> | Promise<Event | undefined>;
    loadFile(path: string): Promise<Event | undefined>;
    loadDirectory(path: string): Promise<Event[]>;
}

declare const defaults: {
    ignoreBots: boolean;
    defaultPrefix: string;
    perGuildPrefix: boolean;
};
declare type JellyCommandsOptions = Partial<typeof defaults>;

declare class JellyCommands {
    #private;
    private eventManager;
    constructor(client: Client, options?: JellyCommandsOptions);
    get client(): Client;
    get options(): Readonly<{
        ignoreBots?: boolean | undefined;
        defaultPrefix?: string | undefined;
        perGuildPrefix?: boolean | undefined;
    }>;
    get events(): EventManager;
}

export { JellyCommands, JellyCommandsOptions, createEvent };
