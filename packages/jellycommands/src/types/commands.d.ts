import type { BaseCommand } from '../JellyCommands/commands/base/BaseCommand';
import type { BaseOptions } from '../JellyCommands/commands/base/options';

export type commandsList = Set<BaseCommand<BaseOptions>>;
export type commandIdMap = Map<string, BaseCommand<BaseOptions>>;

export type guildCommands = Map<string, commandsList>;
export type globalCommands = commandsList;
