import assert from 'assert';
import { test } from 'uvu';

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
    // Both parts are seperated by a `.`
    const InvalidString = clientIdFromToken('MTIzNDU2Nzg5MA==');
    assert.strictEqual(InvalidString, null);

    // If the token is not a string, null is returned
    //! https://github.com/ghostdevv/jellycommands/issues/167
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    //const notString = clientIdFromToken(1234567890);
    //assert.strictEqual(notString, null);
});

test.run();
