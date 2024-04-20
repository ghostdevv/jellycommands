import { type AnyZodObject, z } from 'zod';

export function parseSchema<T extends AnyZodObject>(
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

export const snowflakeSchema = z
    .string({
        invalid_type_error: 'Snowflake ids should be given as a string',
        required_error: 'Must give a valid Snowflake id',
    })
    .min(18, { message: 'Discord Snowflake ids are at least 18 chars' });
