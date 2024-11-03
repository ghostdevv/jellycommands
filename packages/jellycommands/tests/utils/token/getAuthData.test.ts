import { mockClient, mockToken, rawClientId } from '$mock';
import { describe, expect, it, vi } from 'vitest';
import { getAuthData } from '$src/utils/token';

describe('parses auth data from client', () => {
    it('gets the token from the client', () => {
        expect(getAuthData(mockClient())).toEqual({
            clientId: rawClientId,
            token: mockToken,
        });
    });

    it('gets the client id', () => {
        expect(getAuthData(mockClient()).clientId).toBe(rawClientId);
    });

    it('gets the token from environment vars', () => {
        const client = mockClient();
        client.token = null;

        vi.stubEnv('DISCORD_TOKEN', mockToken);

        expect(getAuthData(client)).toEqual({
            clientId: rawClientId,
            token: mockToken,
        });
    });

    it('throws if no token data found', () => {
        const client = mockClient();
        client.token = null;

        expect(() => getAuthData(client)).toThrowError();
    });

    it('throws if no token data found', () => {
        const client = mockClient();
        client.token = 'empty';
        client.user = null;

        expect(() => getAuthData(client)).toThrowError();
    });
});
