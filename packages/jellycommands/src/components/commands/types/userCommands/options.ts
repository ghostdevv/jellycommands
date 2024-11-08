import { baseCommandSchema } from '../../../commands/types/options';
import type { BaseOptions } from '../../../commands/types/options';

export interface UserCommandOptions extends BaseOptions {}

export const userCommandSchema = baseCommandSchema.extend({});
