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

declare class EventManager {
    private client;
    private jelly;
    constructor(jelly: JellyCommands);
    private add;
    load(path: string): Promise<void>;
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

export { EventManager, createEvent };
