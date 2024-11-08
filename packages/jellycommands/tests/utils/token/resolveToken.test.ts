import { describe, expect, it, vi } from 'vitest';
import { resolveToken } from '$src/utils/token';
import { mockClient, mockToken } from '$mock';

describe('resolve token from client', () => {
	it('gets the token', () => {
		expect(resolveToken(mockClient())).toBe(mockToken);
	});

	it('gets the token from environment vars', () => {
		const client = mockClient();
		client.token = null;

		vi.stubEnv('DISCORD_TOKEN', mockToken);

		expect(resolveToken(client)).toBe(mockToken);
	});

	it('returns null if unable to get token', () => {
		const client = mockClient();
		client.token = null;

		expect(resolveToken(client)).toBeNull();
	});
});
