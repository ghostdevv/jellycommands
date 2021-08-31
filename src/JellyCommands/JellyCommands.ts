import type { JellyCommandsOptions } from './options';
import { loadCommands } from './commands';
import { Client } from 'discord.js';
import { schema } from './options';

export class JellyClient extends Client {
    public readonly joptions: JellyCommandsOptions;

    constructor(options: JellyCommandsOptions) {
        super(options.clientOptions);

        /**
         * Validate options
         */
        const { error, value } = schema.validate(options);

        if (error) throw error.annotate();
        else this.joptions = value;
    }

    resolveToken(): string | null {
        if (this.token) return this.token;

        const token = this.joptions.token || process.env?.DISCORD_TOKEN;
        if (token) return token;

        return null;
    }

    resolveClientId(): string | null {
        if (this.user?.id) return this.user?.id;

        const token = this.resolveToken();
        if (!token) return null;

        return Buffer.from(token.split('.')[0], 'base64').toString();
    }
}

export async function jellyCommands(
    options: JellyCommandsOptions,
): Promise<JellyClient> {
    /**
     * Create Client
     */
    const client = new JellyClient(options);

    /**
     * If commands load commands
     */
    if (client.joptions.commands) await loadCommands(client);

    /**
     * Login client
     */
    client.login(client.resolveToken() || undefined);

    return client;
}
