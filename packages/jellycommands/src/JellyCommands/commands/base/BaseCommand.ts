import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v9';
import type { APIApplicationCommandPermission } from 'discord-api-types/v9';
import { ApplicationCommandPermissionType } from 'discord-api-types/v9';
import type { JellyCommands } from '../../JellyCommands';
import type { Interaction } from 'discord.js';
import { BaseOptions } from './options';
import { createHash } from 'crypto';
import Joi from 'joi';

export interface RunOptions<InteractionType extends Interaction> {
    interaction: InteractionType;
    client: JellyCommands;
}

export interface OptionsOptions<OptionsType> {
    options: OptionsType;
    schema: Joi.ObjectSchema<any>;
}

type Awaitable<T> = Promise<T> | T;

export type BaseCommandCallback<InteractionType extends Interaction> =
    ({}: RunOptions<InteractionType>) => Awaitable<void | any>;

export abstract class BaseCommand<
    OptionsType extends BaseOptions = BaseOptions,
    InteractionType extends Interaction = Interaction,
> {
    public readonly options;
    public readonly run: BaseCommandCallback<InteractionType>;

    constructor(
        run: BaseCommand<OptionsType, InteractionType>['run'],
        { options, schema }: OptionsOptions<OptionsType>,
    ) {
        this.run = run;

        if (!run || typeof run != 'function')
            throw new TypeError(
                `Expected type function for run, received ${typeof run}`,
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
    }

    abstract get applicationCommandData(): RESTPostAPIApplicationCommandsJSONBody;

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

    get hashId() {
        return createHash('sha256')
            .update(JSON.stringify(this.options))
            .digest('hex');
    }
}
