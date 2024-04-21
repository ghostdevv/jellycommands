import { parseSchema, snowflakeSchema } from '$src/utils/zod';
import { describe, expect, it } from 'vitest';
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

    it('parses valid snowflake', () => {
        const result = parseSchema('snowflake', snowflakeSchema, '282839711834177537');
        expect(result).toBe('282839711834177537');
    });

    it('parses 19 digit snowflake', () => {
        const result = parseSchema('snowflake', snowflakeSchema, '1162817990652346458');
        expect(result).toBe('1162817990652346458');
    });
});
