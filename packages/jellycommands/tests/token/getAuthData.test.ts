import { test, deepEqual, throws, mockClient, mockToken, rawClientId } from '../common';
import { getAuthData, AuthData } from '../../src/utils/token';

test('Get the token from the client', () => {
    const result = getAuthData(mockClient());
    const expected: AuthData = {
        clientId: rawClientId,
        token: mockToken,
    };

    deepEqual(result, expected);
});

test('Get the token from the env', () => {
    const modifiedMockClient = mockClient();

    modifiedMockClient.token = null;

    process.env.DISCORD_TOKEN = mockToken;

    const result = getAuthData(modifiedMockClient);
    const expected: AuthData = {
        clientId: rawClientId,
        token: mockToken,
    };

    deepEqual(result, expected);

    // Clean up
    delete process.env.DISCORD_TOKEN;
});

test('No env token or no client.token to get the token from', () => {
    const modifiedMockClient = mockClient();

    modifiedMockClient.token = null;

    throws(
        () => {
            getAuthData(modifiedMockClient);
        },
        { name: 'Error', message: 'No token found' },
    );
});

//! client ID error is out of reach and cant be tested
//  test('No client.user or token get the client ID from', () => {
//    const modifiedMockClient = mockClient();
//
//    modifiedMockClient.user = null;
//    modifiedMockClient.token = null;
//
//    throws(
//        () => {
//            getAuthData(modifiedMockClient);
//        },
//        { name: 'Error', message: 'Invalid token provided' },
//    );
//  });

test.run();
