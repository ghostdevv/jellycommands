import type { BaseOptions } from '../../base/options';
import { baseSchema } from '../../base/options';

export interface UserCommandOptions extends BaseOptions {}

export const schema = baseSchema.append({});
