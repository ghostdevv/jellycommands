import assert from 'assert';
import { test } from 'uvu';

import { cleanToken } from '../../../../src/utils/token';

const expectedToken = '1234567890';

test('Strip Bot prefix', () => {
    const token = cleanToken(`Bot ${expectedToken}`);
    assert.strictEqual(token, expectedToken);
});

test('Strip Bearer prefix', () => {
    const token = cleanToken(`Bearer ${expectedToken}`);
    assert.strictEqual(token, expectedToken);
});

test('No prefix', () => {
    const token = cleanToken(expectedToken);
    assert.strictEqual(token, expectedToken);
});

test('No token', () => {
    const token = cleanToken();
    assert.strictEqual(token, null);
});

test('Not a string', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const number = cleanToken(1234567890);
    assert.strictEqual(number, null);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const object = cleanToken({ token: expectedToken });
    assert.strictEqual(object, null);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const array = cleanToken([expectedToken]);
    assert.strictEqual(array, null);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const boolean = cleanToken(true);
    assert.strictEqual(boolean, null);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const undefinedValue = cleanToken(undefined);
    assert.strictEqual(undefinedValue, null);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const nullValue = cleanToken(null);
    assert.strictEqual(nullValue, null);
});

test.run();
