import type { APIApplicationCommandPermission } from 'discord-api-types/v9';
import type { ApplicationCommandData } from '../../../types/rawCommands';
import { ApplicationCommandPermissionType } from 'discord-api-types/v9';
import type { CacheableCommand } from '../../../types/commandCache';
import type { JellyCommands } from '../../JellyCommands';
import type { Interaction } from 'discord.js';
import { BaseOptions } from './options';
import Joi from 'joi';

export interface RunOptions<InteractionType extends Interaction> {
    interaction: InteractionType;
    client: JellyCommands;
}

export interface OptionsOptions<OptionsType> {
    options: OptionsType;
    schema: Joi.ObjectSchema<any>;
}

export abstract class BaseCommand<
    OptionsType extends BaseOptions = BaseOptions,
    InteractionType extends Interaction = Interaction,
> {
    public readonly options;
    public readonly run: ({}: RunOptions<InteractionType>) => void | any;

    public id?: string;
    public filePath?: string;

    constructor(
        run: BaseCommand<OptionsType, InteractionType>['run'],
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

        if (
            !this.options.guilds?.length &&
            !this.options.global &&
            !this.options.dev
        )
            throw new Error(
                'Command must have at least one of guild, global, or dev',
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

        // Disable global in dev mode
        if (this.options.dev) this.options.global = false;
    }

    abstract get applicationCommandData(): ApplicationCommandData;

    get applicationCommandPermissions() {
        if (!this.options.guards) return null;

        const { mode, users, roles } = this.options.guards;

        const permissions: APIApplicationCommandPermission[][] = [];
        const permission = mode == 'whitelist';

        if (users)
            permissions.push(
                users.map((id) => ({
                    id,
                    type: ApplicationCommandPermissionType.User,
                    permission,
                })),
            );

        if (roles)
            permissions.push(
                roles.map((id) => ({
                    id,
                    type: ApplicationCommandPermissionType.Role,
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
