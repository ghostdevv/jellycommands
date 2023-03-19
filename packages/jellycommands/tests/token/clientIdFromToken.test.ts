import { test, equal, mockToken, rawClientId } from '../../common';

import { clientIdFromToken } from '../../../../src/utils/token';

test('With a valid token', () => {
    const result = clientIdFromToken(mockToken);
    equal(result, rawClientId);
});

test.run();
