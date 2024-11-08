import {
    type ApplicationCommandOptionChoiceData,
    type BaseApplicationCommandOptionsData,
    ApplicationCommandOptionType,
    ChannelType,
} from 'discord.js';

type OptionSubcommand = ApplicationCommandOptionType.Subcommand | 'Subcommand';
type OptionSubcommandGroup = ApplicationCommandOptionType.SubcommandGroup | 'SubcommandGroup';
type OptionString = ApplicationCommandOptionType.String | 'String';
type OptionInteger = ApplicationCommandOptionType.Integer | 'Integer';
type OptionBoolean = ApplicationCommandOptionType.Boolean | 'Boolean';
type OptionUser = ApplicationCommandOptionType.User | 'User';
type OptionChannel = ApplicationCommandOptionType.Channel | 'Channel';
type OptionRole = ApplicationCommandOptionType.Role | 'Role';
type OptionMentionable = ApplicationCommandOptionType.Mentionable | 'Mentionable';
type OptionNumber = ApplicationCommandOptionType.Number | 'Number';
type OptionAttachment = ApplicationCommandOptionType.Attachment | 'Attachment';

interface ApplicationCommandSubGroup extends Omit<BaseApplicationCommandOptionsData, 'required'> {
    type: OptionSubcommandGroup;
    options?: ApplicationCommandSubCommand[];
}

type CommandOptionChoiceResolvableType = OptionString | CommandOptionNumericResolvableType;
type CommandOptionSubOptionResolvableType = OptionSubcommand | OptionSubcommandGroup;
type CommandOptionNumericResolvableType = OptionNumber | OptionInteger;

type CommandOptionNonChoiceResolvableType = Exclude<
    ApplicationCommandOptionType,
    CommandOptionChoiceResolvableType | CommandOptionSubOptionResolvableType | OptionChannel
>;

interface ApplicationCommandNonOptions extends BaseApplicationCommandOptionsData {
    type: Exclude<CommandOptionNonChoiceResolvableType, ApplicationCommandOptionType>;
}

interface ApplicationCommandChannelOption extends BaseApplicationCommandOptionsData {
    type: OptionChannel;
    channelTypes?: ChannelType[];
}

interface ApplicationCommandChoicesOption
    extends Omit<BaseApplicationCommandOptionsData, 'autocomplete'> {
    type: CommandOptionChoiceResolvableType;
    choices?: ApplicationCommandOptionChoiceData[];
    autocomplete?: false;
}

interface ApplicationCommandChoicesOption
    extends Omit<BaseApplicationCommandOptionsData, 'autocomplete'> {
    type: CommandOptionChoiceResolvableType;
    choices?: ApplicationCommandOptionChoiceData[];
    autocomplete?: false;
}

interface ApplicationCommandStringOption extends ApplicationCommandChoicesOption {
    type: OptionString;
    minLength?: number;
    maxLength?: number;
}

interface ApplicationCommandAttachmentOption extends BaseApplicationCommandOptionsData {
    type: OptionAttachment;
}

interface ApplicationCommandSubCommand extends Omit<BaseApplicationCommandOptionsData, 'required'> {
    type: OptionSubcommand;
    options?: Exclude<
        JellyApplicationCommandOption,
        ApplicationCommandSubGroup | ApplicationCommandSubCommand
    >[];
}

interface ApplicationCommandNumericOption extends ApplicationCommandChoicesOption {
    type: CommandOptionNumericResolvableType;
    minValue?: number;
    maxValue?: number;
}

interface ApplicationCommandRoleOption extends BaseApplicationCommandOptionsData {
    type: OptionRole;
}

interface ApplicationCommandUserOption extends BaseApplicationCommandOptionsData {
    type: OptionUser;
}

interface ApplicationCommandMentionableOption extends BaseApplicationCommandOptionsData {
    type: OptionMentionable;
}

interface ApplicationCommandBooleanOption extends BaseApplicationCommandOptionsData {
    type: OptionBoolean;
}

interface ApplicationCommandAutocompleteNumericOption
    extends Omit<BaseApplicationCommandOptionsData, 'autocomplete'> {
    type: CommandOptionNumericResolvableType;
    minValue?: number;
    maxValue?: number;
    autocomplete: true;
}

interface ApplicationCommandAutocompleteStringOption
    extends Omit<BaseApplicationCommandOptionsData, 'autocomplete'> {
    type: OptionString;
    minLength?: number;
    maxLength?: number;
    autocomplete: true;
}

// Patch discord.js' ApplicationCommandOption to reallow the string instead of the enum
export type JellyApplicationCommandOption =
    | ApplicationCommandSubGroup
    | ApplicationCommandAutocompleteNumericOption
    | ApplicationCommandAutocompleteStringOption
    | ApplicationCommandNonOptions
    | ApplicationCommandChannelOption
    | ApplicationCommandNumericOption
    | ApplicationCommandStringOption
    | ApplicationCommandRoleOption
    | ApplicationCommandUserOption
    | ApplicationCommandMentionableOption
    | ApplicationCommandBooleanOption
    | ApplicationCommandAttachmentOption
    | ApplicationCommandSubCommand;
