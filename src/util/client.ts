export function resolveClientId(token: string): string | null {
    const split = token.split('.');
    if (!split) return null;

    return Buffer.from(split[0], 'base64').toString();
}
