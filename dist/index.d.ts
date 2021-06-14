import { Client, ClientEvents } from 'discord.js';

interface JellyCommandsOptions {
    ignoreBots?: boolean;
    defaultPrefix?: string;
    perGuildPrefix?: boolean;
}

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

interface EventFile {
    name: keyof ClientEvents;
    disabled: boolean;
    once: boolean;
    run: Function;
}
interface Event {
    name: keyof ClientEvents;
    filePath: string;
    disabled: boolean;
    once: boolean;
}
declare class EventManager {
    private client;
    private jelly;
    constructor(jelly: JellyCommands);
    private add;
    load(path: string): Promise<Event[]> | Promise<Event | undefined>;
    loadFile(path: string): Promise<Event | undefined>;
    loadDirectory(path: string): Promise<Event[]>;
}
declare const createEvent: <K extends keyof ClientEvents>(name: K, data: {
    once?: boolean | undefined;
    disabled?: boolean | undefined;
    run: (instance: {
        client: Client;
        jelly: JellyCommands;
    }, ...args: ClientEvents[K]) => void | any;
}) => {
    once?: boolean | undefined;
    disabled?: boolean | undefined;
    run: (instance: {
        client: Client;
        jelly: JellyCommands;
    }, ...args: ClientEvents[K]) => void | any;
    name: K;
};

export { Event, EventFile, EventManager, createEvent };
