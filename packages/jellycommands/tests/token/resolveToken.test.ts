import { test, equal, mockClient, mockToken } from '../common';
import { resolveToken } from '../../src/utils/token';

test('Get token from client', () => {
    const result = resolveToken(mockClient());
    equal(result, mockToken);
});

test('Get token from env', () => {
    const modifiedMockClient = mockClient();

    modifiedMockClient.token = null;

    process.env.DISCORD_TOKEN = mockToken;

    const result = resolveToken(modifiedMockClient);
    equal(result, mockToken);

    // Clean up
    delete process.env.DISCORD_TOKEN;
});

test('No env token or no client.token to get the token from', () => {
    const modifiedMockClient = mockClient();

    modifiedMockClient.token = null;

    const result = resolveToken(modifiedMockClient);
    equal(result, null);
});

test.run();
