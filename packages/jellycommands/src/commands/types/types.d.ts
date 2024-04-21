import type { MessageCommand } from './messageCommands/MessageCommand';
import type { UserCommand } from './userCommands/UserCommand';
import type { Command } from './commands/Command';
import type { BaseCommand } from './BaseCommand';

export type AnyCommand = BaseCommand | Command | UserCommand | MessageCommand;
