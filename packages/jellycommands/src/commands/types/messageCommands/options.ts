import { baseCommandSchema } from '../../../commands/types/options';
import type { BaseOptions } from '../../../commands/types/options';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MessageCommandOptions extends BaseOptions {}

export const messageCommandSchema = baseCommandSchema.extend({});
