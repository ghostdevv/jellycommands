import {
    ApplicationCommandOptionType,
    ApplicationCommandOption,
    BaseApplicationCommandOptionsData,
    ApplicationCommandOptionChoiceData,
    ChannelType,
} from 'discord.js';

type Subcommand = ApplicationCommandOptionType.Subcommand | 'Subcommand';
type SubcommandGroup = ApplicationCommandOptionType.SubcommandGroup | 'SubcommandGroup';
type String = ApplicationCommandOptionType.String | 'String';
type Integer = ApplicationCommandOptionType.Integer | 'Integer';
type Boolean = ApplicationCommandOptionType.Boolean | 'Boolean';
type User = ApplicationCommandOptionType.User | 'User';
type Channel = ApplicationCommandOptionType.Channel | 'Channel';
type Role = ApplicationCommandOptionType.Role | 'Role';
type Mentionable = ApplicationCommandOptionType.Mentionable | 'Mentionable';
type Number = ApplicationCommandOptionType.Number | 'Number';
type Attachment = ApplicationCommandOptionType.Attachment | 'Attachment';

interface ApplicationCommandSubGroup extends Omit<BaseApplicationCommandOptionsData, 'required'> {
    type: SubcommandGroup;
    options?: ApplicationCommandSubCommand[];
}

type CommandOptionChoiceResolvableType = String | CommandOptionNumericResolvableType;
type CommandOptionSubOptionResolvableType = Subcommand | SubcommandGroup;
type CommandOptionNumericResolvableType = Number | Integer;

type CommandOptionNonChoiceResolvableType = Exclude<
    ApplicationCommandOptionType,
    CommandOptionChoiceResolvableType | CommandOptionSubOptionResolvableType | Channel
>;

interface ApplicationCommandNonOptions extends BaseApplicationCommandOptionsData {
    type: Exclude<CommandOptionNonChoiceResolvableType, ApplicationCommandOptionType>;
}

interface ApplicationCommandChannelOption extends BaseApplicationCommandOptionsData {
    type: Channel;
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
    type: String;
    minLength?: number;
    maxLength?: number;
}

interface ApplicationCommandAttachmentOption extends BaseApplicationCommandOptionsData {
    type: Attachment;
}

interface ApplicationCommandSubCommand extends Omit<BaseApplicationCommandOptionsData, 'required'> {
    type: Subcommand;
    options?: (
        | ApplicationCommandChoicesOption
        | ApplicationCommandNonOptions
        | ApplicationCommandChannelOption
    )[];
}

interface ApplicationCommandNumericOption extends ApplicationCommandChoicesOption {
    type: CommandOptionNumericResolvableType;
    minValue?: number;
    maxValue?: number;
}

interface ApplicationCommandRoleOption extends BaseApplicationCommandOptionsData {
    type: Role;
}

interface ApplicationCommandUserOption extends BaseApplicationCommandOptionsData {
    type: User;
}

interface ApplicationCommandMentionableOption extends BaseApplicationCommandOptionsData {
    type: Mentionable;
}

interface ApplicationCommandBooleanOption extends BaseApplicationCommandOptionsData {
    type: Boolean;
}

// Patch discord.js' ApplicationCommandOption to reallow the string instead of the enum
export type JellyApplicationCommandOption =
    | ApplicationCommandSubGroup
    | ApplicationCommandNonOptions
    | ApplicationCommandChannelOption
    | ApplicationCommandChoicesOption
    | ApplicationCommandNumericOption
    | ApplicationCommandStringOption
    | ApplicationCommandRoleOption
    | ApplicationCommandUserOption
    | ApplicationCommandMentionableOption
    | ApplicationCommandBooleanOption
    | ApplicationCommandAttachmentOption
    | ApplicationCommandSubCommand;
