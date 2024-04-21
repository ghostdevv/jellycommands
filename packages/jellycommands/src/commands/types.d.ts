import { AnyCommand } from './types/types';

export type GlobalCommands = Set<AnyCommand>;
export type GuildCommands = Map<string, Set<AnyCommand>>;

export type CommandIDMap = Map<string, AnyCommand>;

export interface ResolvedCommands {
    guildCommands: GuildCommands;
    globalCommands: GlobalCommands;
    commands: Set<AnyCommand>;
}
