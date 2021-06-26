import type { ClientEvents } from 'discord.js';

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