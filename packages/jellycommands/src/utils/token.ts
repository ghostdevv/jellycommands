import { isSnowflake } from './snowflake';
import type { Client } from 'discord.js';

export function cleanToken(token?: string): string | null {
    return typeof token == 'string' ? token.replace(/^(Bot|Bearer)\s*/i, '') : null;
}

export function clientIdFromToken(token: string): string | null {
    const maybeSnowflake = Buffer.from(token.split('.')[0], 'base64').toString();
    return isSnowflake(maybeSnowflake) ? maybeSnowflake : null;
}

export function resolveToken(client: Client): string | null {
    return client.token || cleanToken(process.env?.DISCORD_TOKEN);
}

export function resolveClientId(client: Client): string | null {
    if (client.user?.id) return client.user?.id;

    const token = resolveToken(client);
    if (!token) return null;

    return clientIdFromToken(token);
}

export interface AuthData {
    token: string;
    clientId: string;
}

export function getAuthData(client: Client): AuthData {
    const token = resolveToken(client);
    if (!token) throw new Error('No token found');

    const clientId = resolveClientId(client);
    if (!clientId) throw new Error('Invalid token provided');

    return { token, clientId };
}
