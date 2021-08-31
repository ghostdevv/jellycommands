import type { JellyCommandsOptions } from './options';
import { loadCommands } from './commands';
import { Client } from 'discord.js';
import { schema } from './options';

export class JellyCommands extends Client {
    public readonly joptions: JellyCommandsOptions;

    constructor(options: JellyCommandsOptions) {
        super(options.clientOptions);

        const { error, value } = schema.validate(options);

        if (error) throw error.annotate();
        else this.joptions = value;
    }

    resolveToken(): string | null {
        return this.token || process.env?.DISCORD_TOKEN || null;
    }

    resolveClientId(): string | null {
        if (this.user?.id) return this.user?.id;

        const token = this.resolveToken();
        if (!token) return null;

        return Buffer.from(token.split('.')[0], 'base64').toString();
    }

    async login(token?: string) {
        if (token) this.token = token;

        if (this.joptions.commands) await loadCommands(this);

        return super.login(this.resolveToken() || undefined);
    }
}
