import { cleanToken } from '$src/utils/token';
import { describe, it, expect } from 'vitest';
import { mockToken } from '$mock';

describe('cleans a discord token', () => {
	it('strips bot prefixes', () => {
		const result = cleanToken(`Bot ${mockToken}`);
		expect(result).toBe(mockToken);
	});

	it('strips bearer prefixes', () => {
		const result = cleanToken(`Bearer ${mockToken}`);
		expect(result).toBe(mockToken);
	});

	it('applies has no prefix', () => {
		const result = cleanToken(mockToken);
		expect(result).toBe(mockToken);
	});

	it('accepts no token', () => {
		const result = cleanToken();
		expect(result).toBeNull();
	});
});
