import type { Client } from 'discord.js';

export function cleanToken(token?: string): string | null {
    return typeof token == 'string'
        ? token.replace(/^(Bot|Bearer)\s*/i, '')
        : null;
}

export function clientIdFromToken(token: string): string | null {
    return Buffer.from(token.split('.')[0], 'base64').toString();
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

export interface AuthDetails {
    token: string;
    clientId: string;
}

export function getAuthDetails(client: Client): AuthDetails {
    const clientId = resolveClientId(client);
    const token = resolveToken(client);

    if (!token) throw new Error('No token found');
    if (!clientId) throw new Error('Invalid token provided');

    return { token, clientId };
}
