import type { Method, AxiosError } from 'axios';
import axios from 'axios';

export function createRequest(token: string) {
    const req = axios.create({
        baseURL: 'https://discord.com/api/v9/',
        headers: {
            Authorization: `Bot ${token}`,
        },
    });

    return <T>(method: Method, route: string, data?: any): Promise<T> =>
        req(route, { method, data })
            .then((res) => res.data as T)
            .catch((e) => {
                if (!axios.isAxiosError(e)) return e;

                const { message } = (e?.response?.data || {}) as {
                    message?: string;
                };

                const error = message
                    ? `[DISCORD API ERROR] ${message} - Try again in ${message}s`
                    : e.message;

                throw new Error(error);
            });
}
