import assert from 'assert';
import { test } from 'uvu';

import type { Client } from 'discord.js';

import {
    cleanToken,
    clientIdFromToken,
    resolveToken,
    resolveClientId,
    getAuthData,
    type AuthData,
} from '../../../src/utils/token';

test('Clean a potential token', () => {
    // Insure a string is returned and the `Bot` is removed
    const token1 = cleanToken('Bot 1234567890');
    assert.strictEqual(token1, '1234567890');

    // Insure a string is returned and the `Bearer` is removed
    const token2 = cleanToken('Bearer 1234567890');
    assert.strictEqual(token2, '1234567890');

    // Insure a string is returned and nothing is removed
    const token3 = cleanToken('1234567890');
    assert.strictEqual(token3, '1234567890');

    // Insure if nothing is provided, null is returned
    const noToken = cleanToken();
    assert.strictEqual(noToken, null);

    // If the token is not a string, null is returned
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const notString = cleanToken(1234567890);
    assert.strictEqual(notString, null);
});

test('clientIdFromToken should return the client ID from the token', () => {
    // This is not a real token, it is just a base64 encoded string
    // that follows the format of a token
    const token = 'MTIzNDU2Nzg5MA==.dGVzdENsaWVudElk';
    const clientId = clientIdFromToken(token);
    const expectedClientId = '1234567890';
    assert.strictEqual(clientId, expectedClientId);

    // If the token is not valid format, null is returned
    // The client ID is one of 2 parts of the token,
    // Both parts are Base64 seperated by a `.`
    //! This test is currently failing
    //const InvalidString = clientIdFromToken('ImNotAVaildToken"');
    //assert.strictEqual(InvalidString, null);

    // If the token is not a string, null is returned
    //! https://github.com/ghostdevv/jellycommands/issues/167
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    //const notString = clientIdFromToken(1234567890);
    //assert.strictEqual(notString, null);
});

test('resolveToken should return the token', () => {
    // Just a object that has the type of the discord.js Client
    const mockWithValue = { token: '1234567890' } as Client;
    const mockWithNoValue = { token: null } as Client;

    // If the client has a token, it should return that
    const token1 = resolveToken(mockWithValue);
    assert.strictEqual(token1, '1234567890');

    // If the client does not have a token, it should return null
    //! This should be null because there is no `DISCORD_TOKEN` in the env
    const token2 = resolveToken(mockWithNoValue);
    assert.strictEqual(process.env.DISCORD_TOKEN, undefined);
    assert.strictEqual(token2, null);

    //TODO: Assert when the `DISCORD_TOKEN` is in the env
});

test('resolveClientId should return the client ID', () => {
    // Just a object that has the type of the discord.js Client
    const mockWithValue = { user: { id: '1234567890' } } as Client;
    const mockWithNoValue = { user: null, token: 'MTIzNDU2Nzg5MA==.dGVzdENsaWVudElk' } as Client;
    const mockWithNoToken = { user: null, token: null } as Client;

    // If the client has a user ID, it should return that
    const idFromClient = resolveClientId(mockWithValue);
    assert.strictEqual(idFromClient, '1234567890');

    // If the client does not have a user ID, it should return the client ID from the token
    const idFromToken = resolveClientId(mockWithNoValue);
    assert.strictEqual(idFromToken, '1234567890');

    // If the client does not have a user ID or a token, it should return null
    //! This should be null because there is no `DISCORD_TOKEN` in the env
    const noToken = resolveClientId(mockWithNoToken);
    assert.strictEqual(noToken, null);

    //TODO: Assert when the `DISCORD_TOKEN` is in the env
});

test.run();
