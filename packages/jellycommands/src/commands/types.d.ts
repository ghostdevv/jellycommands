import { BaseCommand } from './types/BaseCommand';

export type GlobalCommands = Set<BaseCommand>;
export type GuildCommands = Map<string, Set<BaseCommand>>;

export type CommandIDMap = Map<string, BaseCommand>;

interface ResolvedCommands {
    guildCommands: GuildCommands;
    globalCommands: GlobalCommands;
    commands: Set<BaseCommand>;
}
