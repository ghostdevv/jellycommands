import { SnowflakeUtil } from 'discord.js';
import { z } from 'zod';

export function isSnowflake(id: any): id is string {
    try {
        SnowflakeUtil.deconstruct(id);
        return true;
    } catch {
        return false;
    }
}

export const snowflakeSchema = z
    .string({
        invalid_type_error: 'Snowflake ids should be given as a string',
        required_error: 'Must give a valid Snowflake id',
    })
    .min(18, { message: 'Discord Snowflake ids are at least 18 chars' });
