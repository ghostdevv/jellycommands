import type { BaseOptions } from '../../base/options';
import { baseSchema } from '../../base/options';
export interface MessageCommandOptions extends BaseOptions {}

export const schema = baseSchema.append({});
