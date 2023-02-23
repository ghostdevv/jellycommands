import assert from 'assert';
import { test } from 'uvu';

import { cleanToken } from '../../../src/utils/token';

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

test.run();
