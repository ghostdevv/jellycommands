import { resolveClientId } from '$src/utils/token';
import { mockClient, rawClientId } from '$mock';
import { describe, expect, it } from 'vitest';

describe('resolves client id', () => {
	it('gets the client id', () => {
		expect(resolveClientId(mockClient())).toBe(rawClientId);
	});

	it('gets the client id from the token', () => {
		const client = mockClient();
		client.user = null;

		expect(resolveClientId(client)).toBe(rawClientId);
	});

	it('returns null if unable to find', () => {
		const client = mockClient();
		client.user = null;
		client.token = null;

		expect(resolveClientId(client)).toBeNull();
	});
});
