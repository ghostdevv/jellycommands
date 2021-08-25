import type { MessagePayload, MessageOptions } from 'discord.js';

export interface JellyCommandsOptions {
    messages?: {
        unknownCommand?: string | MessagePayload | MessageOptions;
    };
}
