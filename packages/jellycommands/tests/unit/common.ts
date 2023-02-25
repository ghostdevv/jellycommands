export const token = 'ImAToken';
export const clientId = 'ImAClientId';
export const tokenEncoded = Buffer.from(token).toString('base64');
export const clientIdEncoded = Buffer.from(clientId).toString('base64');
export const mockToken = `${clientIdEncoded}.${tokenEncoded}`;