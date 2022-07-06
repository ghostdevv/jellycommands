import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';
import type { ApplicationCommandType } from 'discord-api-types/v10';
import type { JellyCommands } from '../../JellyCommands';
import type { Interaction } from 'discord.js';
import { Permissions } from 'discord.js';
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

export type BaseCommandCallback<InteractionType extends Interaction> = (
    options: RunOptions<InteractionType>,
) => Awaitable<void | any>;

export abstract class BaseCommand<
    OptionsType extends BaseOptions = BaseOptions,
    InteractionType extends Interaction = Interaction,
> {
    public readonly options: OptionsType;

    public abstract readonly type: ApplicationCommandType;

    constructor(
        public readonly run: BaseCommandCallback<InteractionType>,
        { options, schema }: OptionsOptions<OptionsType>,
    ) {
        if (!run || typeof run != 'function')
            throw new TypeError(`Expected type function for run, received ${typeof run}`);

        const { error, value } = schema.validate(options);

        if (error) throw error.annotate();

        this.options = value as typeof options;

        if (!this.options.guilds?.length && !this.options.global && !this.options.dev)
            throw new Error('Command must have at least one of guild, global, or dev');

        if (this.options.global && !this.options.guilds?.length && this.options.guards) {
            throw new Error(
                'If using guards on a global command you must have a guilds array, guards can only be applied to guilds',
            );
        }
    }

    get applicationCommandData(): RESTPostAPIApplicationCommandsJSONBody {
        return {
            name: this.options.name,
            type: this.type,
            description: '',
            default_member_permissions: this.applicationCommandPermissions,
            dm_permission: this.options.dm ?? true,
        };
    }

    get applicationCommandPermissions(): string | null {
        if (this.options.guards?.permissions) {
            const { bitfield } = new Permissions(this.options.guards.permissions);
            return bitfield.toString();
        }

        return null;
    }

    get hashId() {
        return createHash('sha256').update(JSON.stringify(this.options)).digest('hex');
    }
}
