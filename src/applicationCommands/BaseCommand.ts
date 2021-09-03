import type { JellyCommands } from '../JellyCommands/JellyCommands';
import type { ApplicationCommandPermissions } from '../types/applicationCommands';
import type { InteractionDeferReplyOptions } from 'discord.js';
import type { ApplicationCommandData } from '../types/applicationCommands';
import type { CommandInteraction } from 'discord.js';

import { snowflakeArray } from '../util/joi';
import Joi from 'joi';

export interface BaseOptions {
    /**
     * Should the interaction be defered?
     */
    defer?: boolean | InteractionDeferReplyOptions;

    /**
     * Guards allow you to prevent/allow certain people/groups to your command
     */
    guards?: {
        /**
         * Should the guards act as a whitelist or blacklist
         */
        mode: 'whitelist' | 'blacklist';

        /**
         * Which users should be allowed only (whitelist) or should be blocked (blacklist)
         */
        users?: string[];

        /**
         * Which roles should be allowed only (whitelist) or should be blocked (blacklist)
         */
        roles?: string[];
    };

    /**
     * The guilds to apply the slash command in
     */
    guilds?: string[];

    /**
     * Should the slash command be global across all guilds
     */
    global?: boolean;

    /**
     * Whether or not the slash command should be loaded
     */
    disabled?: boolean;
}

export const baseSchema = Joi.object({
    defer: [
        Joi.bool(),
        Joi.object({
            ephemeral: Joi.bool(),
            fetchReply: Joi.bool(),
        }),
    ],

    guards: Joi.object({
        mode: Joi.string().valid('whitelist', 'blacklist').required(),
        users: snowflakeArray(),
        roles: snowflakeArray(),
    }),

    guilds: snowflakeArray(),
    global: Joi.bool().default(false),
    disabled: Joi.bool().default(false),
});

export interface RunOptions {
    interaction: CommandInteraction;
    client: JellyCommands;
}

export abstract class BaseCommand {
    abstract options: BaseOptions;

    constructor() {}

    abstract get applicationCommandData(): ApplicationCommandData;

    abstract run({}: RunOptions): void | any;

    get applicationCommandPermissions() {
        if (!this.options.guards) return null;

        const { mode, users, roles } = this.options.guards;

        const permissions: ApplicationCommandPermissions[][] = [];
        const permission = mode == 'whitelist';

        if (users)
            permissions.push(users.map((id) => ({ id, type: 2, permission })));

        if (roles)
            permissions.push(roles.map((id) => ({ id, type: 1, permission })));

        return permissions.flat();
    }
}
