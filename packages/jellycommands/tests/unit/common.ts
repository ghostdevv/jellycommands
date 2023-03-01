import { Client as djsClient } from 'discord.js';

export { test } from 'uvu';
export { strictEqual as equal, deepStrictEqual as deepEqual, throws } from 'assert';

export const rawToken = 'ImAToken';
export const rawClientId = 'ImAClientId';

export const encodedToken = Buffer.from(rawToken).toString('base64');
export const encodedClientId = Buffer.from(rawClientId).toString('base64');

export const mockToken = `${encodedClientId}.${encodedToken}`;
export const mockClient = () => {
    return {
        token: mockToken,
        user: {
            id: rawClientId,
        },
    } as djsClient;
};
