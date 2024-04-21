import { commandSchema } from '$src/commands/types/commands/options';
import { parseSchema } from '$src/utils/zod';
import { describe, expect, it } from 'vitest';

describe('command options schema', () => {
    it('works simply', () => {
        expect(() =>
            commandSchema.parse({ name: 'name', description: 'descriptive' }),
        ).not.toThrowError();
    });
});
