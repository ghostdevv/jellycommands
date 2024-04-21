import { JellyCommands } from '$src/JellyCommands';
import { Client } from 'discord.js';
import { vi } from 'vitest';

export const rawToken = 'ImAToken';
export const rawClientId = '843642576971759667';

export const encodedToken = Buffer.from(rawToken).toString('base64');
export const encodedClientId = Buffer.from(rawClientId).toString('base64');

export const mockToken = `${encodedClientId}.${encodedToken}`;

export function mockClient() {
    const client = new Client({ intents: [] });

    client.token = mockToken;
    // @ts-expect-error missing properties
    client.user = { id: rawClientId };

    return client;
}

export function mockJellyClient() {
    const client = new JellyCommands({
        clientOptions: { intents: [] },
    });

    client.token = encodedToken;
    // @ts-expect-error missing properties
    client.user = { id: rawClientId };

    return client;
}
