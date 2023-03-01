import { test, equal, mockToken } from '../../common';

import { cleanToken } from '../../../../src/utils/token';

test('Strip Bot prefix', () => {
    const result = cleanToken(`Bot ${mockToken}`);
    equal(result, mockToken);
});

test('Strip Bearer prefix', () => {
    const result = cleanToken(`Bearer ${mockToken}`);
    equal(result, mockToken);
});

test('No prefix', () => {
    const result = cleanToken(mockToken);
    equal(result, mockToken);
});

test('No token', () => {
    const result = cleanToken();
    equal(result, null);
});

test.run();
