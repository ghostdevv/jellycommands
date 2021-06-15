import type { JellyCommands } from '../core/JellyCommands';
import type { Client, ClientEvents } from 'discord.js';
export interface EventFile {
    name: keyof ClientEvents;
    disabled: boolean;
    once: boolean;
    run: Function;
}
export interface Event {
    name: keyof ClientEvents;
    filePath: string;
    disabled: boolean;
    once: boolean;
}
export declare class EventManager {
    private client;
    private jelly;
    constructor(jelly: JellyCommands);
    private add;
    load(path: string): Promise<Event[]> | Promise<Event | undefined>;
    loadFile(path: string): Promise<Event | undefined>;
    loadDirectory(path: string): Promise<Event[]>;
}
export declare const createEvent: <K extends keyof ClientEvents>(name: K, data: {
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
