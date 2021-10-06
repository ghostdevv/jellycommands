import type { ApplicationCommandPermissions } from '../../types/applicationCommands.d';
import { ApplicationCommandPermissionType } from '../../types/applicationCommands.d';
import type { ApplicationCommandData } from '../../types/applicationCommands.d';
import type { InteractionDeferReplyOptions } from 'discord.js';
import type { CommandCache } from './ApplicationCommandCache';
import type { JellyCommands } from '../JellyCommands';
import type { CommandInteraction } from 'discord.js';

import { snowflakeArray } from '../../util/joi';
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

export interface OptionsOptions<OptionsType> {
    options: OptionsType;
    schema: Joi.ObjectSchema<any>;
}

export abstract class BaseCommand<OptionsType extends BaseOptions> {
    public readonly name;
    public readonly options;
    public readonly run: ({}: RunOptions) => void | any;

    public id?: string;
    public filePath?: string;

    constructor(
        name: string,
        run: BaseCommand<OptionsType>['run'],
        { options, schema }: OptionsOptions<OptionsType>,
    ) {
        this.name = name;

        if (!name || typeof name != 'string')
            throw new TypeError(
                `Expected type string for name, recieved ${typeof name}`,
            );

        this.run = run;

        if (!run || typeof run != 'function')
            throw new TypeError(
                `Expected type function for run, recieved ${typeof run}`,
            );

        const { error, value } = schema.validate(options);

        if (error) throw error.annotate();

        this.options = value as typeof options;

        if (!this.options.guilds?.length && !this.options.global)
            throw new Error(
                'Command must have at least one of guild or global',
            );

        if (
            this.options.global &&
            !this.options.guilds?.length &&
            this.options.guards
        ) {
            throw new Error(
                'If using guards on a global command you must have a guilds array, guards can only be applied to guilds',
            );
        }
    }

    abstract get applicationCommandData(): ApplicationCommandData;

    get applicationCommandPermissions() {
        if (!this.options.guards) return null;

        const { mode, users, roles } = this.options.guards;

        const permissions: ApplicationCommandPermissions[][] = [];
        const permission = mode == 'whitelist';

        if (users)
            permissions.push(
                users.map((id) => ({
                    id,
                    type: ApplicationCommandPermissionType.USER,
                    permission,
                })),
            );

        if (roles)
            permissions.push(
                roles.map((id) => ({
                    id,
                    type: ApplicationCommandPermissionType.ROLE,
                    permission,
                })),
            );

        return permissions.flat();
    }

    toCachable(cacheData = false): CommandCache {
        return {
            name: this.name,
            options: this.options,

            cacheData: cacheData
                ? {
                      id: this.id as string,
                      filePath: this.filePath as string,
                  }
                : undefined,
        };
    }
}
