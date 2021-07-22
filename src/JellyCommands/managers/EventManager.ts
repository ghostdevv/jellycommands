import BaseManager from './BaseManager';
import { Event } from '../events/Event';

import type { JellyCommands } from '../JellyCommands';
import type { Client } from 'discord.js';

export default class EventManager extends BaseManager<Event> {
    private client: Client;
    private jelly: JellyCommands;

    private loadedPaths = new Set<string>();

    constructor(jelly: JellyCommands) {
        super();

        this.jelly = jelly;
        this.client = jelly.client;
    }

    protected add(event: Event, path: string) {
        if (this.loadedPaths.has(path))
            throw new Error(
                `The path ${path} has already been loaded, therefore can not be loaded again`,
            );

        this.loadedPaths.add(path);

        if (event.options.disabled) return;

        const cb = (...ctx: any[]) =>
            event.run(...ctx, { client: this.client, jelly: this.jelly });

        if (event.options.once) this.client.once(event.name, cb);
        else this.client.on(event.name, cb);
    }
}
