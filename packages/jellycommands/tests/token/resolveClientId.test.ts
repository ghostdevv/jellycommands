import { test, equal, mockClient, rawClientId } from '../common';
import { resolveClientId } from '../../src/utils/token';

test('Get the ID from the client', () => {
    const result = resolveClientId(mockClient());
    equal(result, rawClientId);
});

test('Get the ID from the token', () => {
    const modifiedMockClient = mockClient();

    modifiedMockClient.user = null;

    const result = resolveClientId(modifiedMockClient);
    equal(result, rawClientId);
});

test('No token or no client.user to get the ID from', () => {
    const modifiedMockClient = mockClient();

    modifiedMockClient.user = null;
    modifiedMockClient.token = null;

    const result = resolveClientId(modifiedMockClient);
    equal(result, null);
});

test.run();
