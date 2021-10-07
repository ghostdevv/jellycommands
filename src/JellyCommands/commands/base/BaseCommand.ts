import type { ApplicationCommandPermissions } from '../../../types/applicationCommands.d';
import { ApplicationCommandPermissionType } from '../../../types/applicationCommands.d';
import type { ApplicationCommandData } from '../../../types/applicationCommands';
import type { CacheableCommand } from '../CommandCache';
import type { JellyCommands } from '../../JellyCommands';
import type { CommandInteraction } from 'discord.js';
import { BaseOptions } from './options';
import Joi from 'joi';

export interface RunOptions {
    interaction: CommandInteraction;
    client: JellyCommands;
}

export interface OptionsOptions<OptionsType> {
    options: OptionsType;
    schema: Joi.ObjectSchema<any>;
}

export abstract class BaseCommand<OptionsType extends BaseOptions> {
    public readonly options;
    public readonly run: ({}: RunOptions) => void | any;

    public id?: string;
    public filePath?: string;

    constructor(
        run: BaseCommand<OptionsType>['run'],
        { options, schema }: OptionsOptions<OptionsType>,
    ) {
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

    toCachable(): CacheableCommand {
        return {
            options: this.options,
            filePath: this.filePath as string,
        };
    }
}
