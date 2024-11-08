import { isSnowflake, snowflakeSchema } from '$src/utils/snowflake';
import { describe, expect, it } from 'vitest';

describe('snowflake schema', () => {
	it('parses valid snowflake', () => {
		const result = snowflakeSchema.safeParse('282839711834177537');

		expect(result.success).toBe(true);
		expect(result.success && result.data).toBe('282839711834177537');
	});

	it('parses 19 digit snowflake', () => {
		const result = snowflakeSchema.safeParse('1162817990652346458');

		expect(result.success).toBe(true);
		expect(result.success && result.data).toBe('1162817990652346458');
	});
});

describe('snowflake utils', () => {
	it('works on valid snowflake', () => {
		expect(isSnowflake('282839711834177537')).toBe(true);
	});

	it('fails on invalid snowflake', () => {
		expect(isSnowflake('empty')).toBe(false);
	});
});
