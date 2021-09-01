import type { Method } from 'axios';
import axios from 'axios';

export function createRequest(token: string) {
    const req = axios.create({
        baseURL: 'https://discord.com/api/v9/',
        headers: {
            Authorization: `Bot ${token}`,
        },
    });

    return <T>(method: Method, route: string, data: any) =>
        req(route, { method, data }).then((res) => res.data as T);
}
