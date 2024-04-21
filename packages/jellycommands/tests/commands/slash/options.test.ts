import { commandSchema } from '$src/commands/types/commands/options';
import { parseSchema } from '$src/utils/zod';
import { describe, expect, it } from 'vitest';

describe('command options schema', () => {
    it('works simply', () => {
        expect(() =>
            commandSchema.parse({ name: 'name', description: 'descriptive' }),
        ).not.toThrowError();
    });

    it('rejects invalid names', () => {
        const description = 'descriptive';

        expect(() => commandSchema.parse({ name: 'NAME', description })).toThrowError();
        expect(() => commandSchema.parse({ name: 'spaces are wrong', description })).toThrowError();
        expect(() => commandSchema.parse({ name: 'no'.repeat(200), description })).toThrowError();
        expect(() => commandSchema.parse({ name: 'a'.repeat(33), description })).toThrowError();
    });

    it('rejects invalid descriptions', () => {
        const name = 'name';

        expect(() => commandSchema.parse({ name })).toThrowError();
        expect(() => commandSchema.parse({ name, description: 'no'.repeat(200) })).toThrowError();
        expect(() => commandSchema.parse({ name, description: 'a'.repeat(101) })).toThrowError();
    });

    it('supports description localisations', () => {
        const result = parseSchema('command', commandSchema, {
            name: 'name',
            description: 'descriptive',
            descriptionLocalizations: {
                'en-gb': 'it works',
            },
        });

        expect(result.descriptionLocalizations?.['en-gb']).toBe('it works');
    });

    it('supports options', () => {
        const result = parseSchema('command', commandSchema, {
            name: 'name',
            description: 'descriptive',
            options: [
                {
                    type: 'Channel',
                    name: 'channel',
                    description: 'channel to use',
                    required: true,
                },
            ],
        });

        expect(result.options).toHaveLength(1);
        expect(result.options?.[0]?.name).toBe('channel');
    });
});
