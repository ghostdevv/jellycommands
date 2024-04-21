import { z } from 'zod';

export function parseSchema<T extends z.ZodType>(
    name: string,
    schema: T,
    data: unknown,
): z.infer<T> {
    const result = schema.safeParse(data);
    if (result.success) return result.data;

    const formattedError = result.error.errors
        .map((e) => `    => [${e.path.join(' -> ')}] (${e.code}) ${e.message}`)
        .join('\n');

    throw new TypeError(`Error parsing schema for ${name}:\n${formattedError}\n`);
}
