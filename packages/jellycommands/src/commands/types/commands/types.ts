import {
    ApplicationCommandOption,
    ApplicationCommandAttachmentOption,
    ApplicationCommandChannelOption,
    ApplicationCommandChoicesOption,
    ApplicationCommandNonOptions,
    ApplicationCommandNumericOption,
    ApplicationCommandStringOption,
    ApplicationCommandSubCommand,
    ApplicationCommandSubGroup,
} from 'discord.js';

// Patch discord.js' ApplicationCommandOption to reallow the string instead of the enum
export type JellyApplicationCommandOption =
    | PatchOption<ApplicationCommandSubGroup>
    | PatchOption<ApplicationCommandNonOptions>
    | PatchOption<ApplicationCommandChannelOption>
    | PatchOption<ApplicationCommandChoicesOption>
    | PatchOption<ApplicationCommandNumericOption>
    | PatchOption<ApplicationCommandStringOption>
    | PatchOption<ApplicationCommandAttachmentOption>
    | PatchOption<ApplicationCommandSubCommand>;

interface ReverseApplicationCommandOptionType {
    1: 'Subcommand';
    2: 'SubcommandGroup';
    3: 'String';
    4: 'Integer';
    5: 'Boolean';
    6: 'User';
    7: 'Channel';
    8: 'Role';
    9: 'Mentionable';
    10: 'Number';
    11: 'Attachment';
}

type PatchOption<T extends ApplicationCommandOption> = Omit<T, 'type'> & {
    type: T['type'] | ReverseApplicationCommandOptionType[T['type']];
};
