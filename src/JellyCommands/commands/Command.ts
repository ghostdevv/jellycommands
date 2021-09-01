import { schema, CommandOptions } from './options';
import { removeKeys } from 'ghoststools';

import type { Client, CommandInteraction } from 'discord.js';

enum PermissionType {
    role = 1,
    user = 2,
}

interface Permission {
    id: string;
    type: PermissionType;
    permission: boolean;
}

export class Command {
    public readonly name;
    public readonly run;
    public readonly options: CommandOptions;

    constructor(
        name: string,
        run: ({}: {
            interaction: CommandInteraction;
            client: Client;
        }) => void | any,
        options: CommandOptions,
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
        else this.options = value;

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

    get applicationCommandData() {
        const default_permission =
            this.options.guards && this.options.guards.mode == 'blacklist';

        return {
            name: this.name,
            description: this.options.description,
            options: this.options.options,
            default_permission,
        };
    }

    get applicationCommandPermissions(): Permission[] | null {
        if (!this.options.guards) return null;

        const { mode, users, roles } = this.options.guards;

        const permissions: Permission[][] = [];
        const permission = mode == 'whitelist';

        if (users)
            permissions.push(users.map((id) => ({ id, type: 2, permission })));

        if (roles)
            permissions.push(roles.map((id) => ({ id, type: 1, permission })));

        return permissions.flat();
    }
}

export const command = (
    name: string,
    options: CommandOptions & {
        run: Command['run'];
    },
) => {
    return new Command(
        name,
        options.run,
        removeKeys(options, 'run') as CommandOptions,
    );
};
