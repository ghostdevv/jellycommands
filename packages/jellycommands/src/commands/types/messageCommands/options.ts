import type { BaseOptions } from '../../../commands/types/options';
import { baseSchema } from '../../../commands/types/options';

export interface MessageCommandOptions extends BaseOptions {}

export const schema = baseSchema.append({});
