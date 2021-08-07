import type { MessagePayload, MessageOptions } from 'discord.js';

export interface JellyCommandsOptions {
    ignoreBots?: boolean;
    prefix?: string;

    guards?: {};

    messages?: {
        unknownCommand: undefined | (string | MessagePayload | MessageOptions);
    };
}

export interface FullJellyCommandsOptions {
    ignoreBots: boolean;
    prefix: string;

    guards: {};

    messages: {
        unknownCommand: undefined | (string | MessagePayload | MessageOptions);
    };
}
