import { EventManager } from '../events/EventManager';
import type { JellyCommandsOptions } from './options';
import type { Client } from 'discord.js';
export declare class JellyCommands {
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
