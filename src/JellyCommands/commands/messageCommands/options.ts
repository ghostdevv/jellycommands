import type { BaseOptions } from '../BaseCommand';
import { baseSchema } from '../BaseCommand';

export interface MessageCommandOptions extends BaseOptions {}

export const schema = baseSchema.append({});
