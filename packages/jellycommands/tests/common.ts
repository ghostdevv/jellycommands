import type { Client } from 'discord.js';

export const rawToken = 'ImAToken';
export const rawClientId = 'ImAClientId';

export const encodedToken = Buffer.from(rawToken).toString('base64');
export const encodedClientId = Buffer.from(rawClientId).toString('base64');

export const mockToken = `${encodedClientId}.${encodedToken}`;
export function mockClient() {
    return {
        token: mockToken,
        user: {
            id: rawClientId,
        },
    } as Client;
}

export { test } from 'uvu';
export { strictEqual as equal, deepStrictEqual as deepEqual, throws } from 'assert';
