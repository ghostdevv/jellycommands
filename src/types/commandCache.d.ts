import type { BaseOptions } from '../JellyCommands/commands/base/options';
import type { guildCommands, globalCommands } from './commands.d';

export interface CacheableCommand {
    options: BaseOptions;
    filePath: string;
}

export interface GuildCommandGroup {
    guildId: string;
    commands: CacheableCommand[];
}

export interface CommandPair {
    guildCommands: GuildCommandGroup[];
    globalCommands: CacheableCommand[];
}

export interface RuntimeCommandPair {
    guildCommands: guildCommands;
    globalCommands: globalCommands;
}
