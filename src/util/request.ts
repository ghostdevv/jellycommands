import type { Method } from 'axios';
import axios from 'axios';

export function createRequest(token: string) {
    const req = axios.create({
        baseURL: 'https://discord.com/api/v9/',
        headers: {
            Authorization: `Bot ${token}`,
        },
    });

    interface ResponseObject {
        message?: string;
        _errors?: { code: string; message: string }[];
    }

    return <T>(method: Method, route: string, data?: any): Promise<T> =>
        req(route, { method, data })
            .then((res) => res.data as T)
            .catch((e) => {
                if (!axios.isAxiosError(e)) return e;

                const { message, _errors } = (e?.response?.data ||
                    {}) as ResponseObject;

                if (_errors) console.error(`[DISCORD API ERROR] ${_errors}`);

                const error = message
                    ? `[DISCORD API ERROR] ${message} - Try again in ${message}s`
                    : e.message;

                throw new Error(error);
            });
}
