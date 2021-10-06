import type { BaseOptions } from '../../BaseCommand';
import { baseSchema } from '../../BaseCommand';

export interface UserCommandOptions extends BaseOptions {}

export const schema = baseSchema.append({});
