import { defaults, schema } from './options';
import { readdirJSFiles } from '../util/fs';

import type { Client, ClientEvents } from 'discord.js';
import type { JellyCommands } from '../JellyCommands';

export interface EventFile {
    name: keyof ClientEvents;
    disabled: boolean;
    once: boolean;
    run: Function;
}

export class EventManager {
    private client: Client;
    private jelly: JellyCommands;

    constructor(jelly: JellyCommands) {
        this.jelly = jelly;
        this.client = jelly.client;
    }

    private add(name: string, data: EventFile) {
        const cb = (...ctx: any[]) =>
            data.run(...ctx, { client: this.client, jelly: this.jelly });

        if (data.once) this.client.once(name, cb);
        else this.client.on(name, cb);
    }

    load(path: string) {
        const paths = readdirJSFiles(path);

        for (const { data } of paths) {
            const { error, value } = schema.validate(
                Object.assign(defaults, data),
            );

            if (error) throw error.annotate();
            else this.add(value.name, value);
        }
    }
}

export const createEvent = <K extends keyof ClientEvents>(
    name: K,
    data: {
        once?: boolean;
        disabled?: boolean;
        run: (
            instance: { client: Client; jelly: JellyCommands },
            ...args: ClientEvents[K]
        ) => void | any;
    },
) => ({ name, ...data });
