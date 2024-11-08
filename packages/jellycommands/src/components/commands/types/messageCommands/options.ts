import { baseCommandSchema } from '../../../commands/types/options';
import type { BaseOptions } from '../../../commands/types/options';

export interface MessageCommandOptions extends BaseOptions {}

export const messageCommandSchema = baseCommandSchema.extend({});
