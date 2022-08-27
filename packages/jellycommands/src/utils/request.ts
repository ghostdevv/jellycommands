import { RouteBases } from 'discord-api-types/v10';
import type { AxiosError, Method } from 'axios';
import axios from 'axios';

interface DiscordErrorResponse {
    message?: string;
    errors?: { code: string; message: string }[];
    _errors?: { code: string; message: string }[];
}

export function createRequest(token: string) {
    const req = axios.create({
        baseURL: RouteBases.api,
        headers: {
            Authorization: `Bot ${token}`,
        },
    });

    return <Response = Record<string, any>, Data = any>(
        method: Method,
        route: string,
        data?: Data,
    ): Promise<Response> =>
        req(route, { method, data })
            .then((res) => res.data)
            .catch((e: AxiosError<DiscordErrorResponse>) => {
                if (!axios.isAxiosError(e) || !e?.response?.data) throw e;

                const { message, errors, _errors } = e.response.data;

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
