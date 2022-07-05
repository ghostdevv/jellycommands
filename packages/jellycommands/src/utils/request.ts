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
        errors?: { code: string; message: string }[];
        _errors?: ResponseObject['errors'];
    }

    return <Response = Record<string, any>, Data = any>(
        method: Method,
        route: string,
        data?: Data,
    ): Promise<Response> =>
        req(route, { method, data })
            .then((res) => res.data)
            .catch((e) => {
                if (!axios.isAxiosError(e)) throw e;

                const { message, errors, _errors } = (e?.response?.data ||
                    {}) as ResponseObject;

                if (errors || _errors)
                    console.error(
                        `[DISCORD API ERROR] ${method.toUpperCase()} ${route}] ${JSON.stringify(
                            errors || _errors,
                            null,
                            4,
                        )}`,
                    );

                const error = message
                    ? `[DISCORD API ERROR] [${method.toUpperCase()} ${route}] ${message}`
                    : e.message;

                throw new Error(error);
            });
}
