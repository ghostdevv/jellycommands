import type { JellyCommandsOptions } from './options';
import { resolveClientId } from '../util/client';
import { loadCommands } from './commands';
import { Client } from 'discord.js';
import { schema } from './options';

class JellyClient extends Client {
    constructor(options: JellyCommandsOptions) {
        super(options.clientOptions);
    }
}

export async function jellyCommands(
    options: JellyCommandsOptions,
): Promise<JellyClient> {
    /**
     * Resolve token
     */
    const token = options.token || process.env?.DISCORD_TOKEN;
    if (!token) throw new Error('No token provided');

    /**
     * Resolve client ID
     */
    const clientID = resolveClientId(token);
    if (!clientID) throw new Error('Invalid token provided');

    /**
     * Validate options with joi
     */
    const { error, value } = schema.validate(options);

    if (error) throw error.annotate();
    else options = value;

    /**
     * If commands load commands
     */
    if (options.commands) await loadCommands(options.commands, token, clientID);

    /**
     * Create and login client
     */
    const client = new JellyClient(options);

    client.login(token);

    return client;
}
