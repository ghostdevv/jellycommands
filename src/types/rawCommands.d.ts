import type { ApplicationCommandOptionData } from 'discord.js';

export enum ApplicationCommandType {
    CHAT_INPUT = 1,
    USER = 2,
    MESSAGE = 3,
}

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

export enum ApplicationCommandPermissionType {
    ROLE = 1,
    USER = 2,
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
