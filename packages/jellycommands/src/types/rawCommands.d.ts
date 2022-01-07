import type { ApplicationCommandOptionData } from 'discord.js';
import {
    ApplicationCommandType,
    ApplicationCommandPermissionType,
} from 'discord-api-types/v9';

export interface ApplicationCommandData {
    name: string;
    description: string;
    options?: ApplicationCommandOptionData[];
    default_permission: boolean;
    type: ApplicationCommandType;
}

export interface ApplicationCommand {
    id: string;
    type?: ApplicationCommandType;
    application_id: string;
    guild_id?: string;
    name: string;
    description: string;
    options?: ApplicationCommandOptionData[];
    default_permission?: boolean;
}

export interface ApplicationCommandPermissions {
    id: string;
    type: ApplicationCommandPermissionType;
    permission: boolean;
}

export interface GuildApplicationPermissionData {
    id: string;
    permissions: ApplicationCommandPermissions[];
}
