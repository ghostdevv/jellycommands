import { describe, expect, it } from 'vitest';
import { parseSchema } from '$src/utils/zod';
import { z } from 'zod';

describe('zod utils', () => {
	it('parses schema', () => {
		const now = Date.now();
		const result = parseSchema('test', z.number(), now);

		expect(result).toBe(now);
	});

	it('throws on invalid data', () => {
		expect(() => parseSchema('test', z.string(), 10)).toThrowError();
	});
});
