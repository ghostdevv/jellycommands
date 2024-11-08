import { clientIdFromToken } from '$src/utils/token';
import { mockToken, rawClientId } from '$mock';
import { describe, it, expect } from 'vitest';

describe('parse client id from token', () => {
	it('works', () => {
		const result = clientIdFromToken(mockToken);
		expect(result).toBe(rawClientId);
	});

	it('returns null on invalid id', () => {
		expect(clientIdFromToken('empty')).toBeNull();
	});
});
