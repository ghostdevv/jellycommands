import { test } from 'uvu';
import assert from 'assert';

import { mockToken, clientId } from '../../common';

import { clientIdFromToken } from '../../../../src/utils/token';

test('With a valid token', () => {
    const result = clientIdFromToken(mockToken);
    assert.strictEqual(result, clientId);
});

test.run();
