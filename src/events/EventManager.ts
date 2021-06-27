import { readdirJSFiles, readJSFile } from '../util/fs';
import { Event } from './Event';
import { lstatSync } from 'fs';
import { parse } from 'path';

import type { JellyCommands } from '../core/JellyCommands';
import type { Client } from 'discord.js';

export class EventManager {
    private client: Client;
    private jelly: JellyCommands;

    private loadedPaths = new Set<string>();

    constructor(jelly: JellyCommands) {
        this.jelly = jelly;
        this.client = jelly.client;
    }

    private add(event: Event) {
        const cb = (...ctx: any[]) =>
            event.run(...ctx, { client: this.client, jelly: this.jelly });

        if (event.options.once) this.client.once(event.name, cb);
        else this.client.on(event.name, cb);
    }

    private addPath(path: string) {
        if (this.loadedPaths.has(path))
            throw new Error(
                `The path ${path} has already been loaded, please do not attempt to load it twice`,
            );
        else this.loadedPaths.add(path);
    }

    load(path: string) {
        const isDirectory = lstatSync(path).isDirectory();
        return isDirectory ? this.loadDirectory(path) : this.loadFile(path);
    }

    async loadFile(path: string) {
        const { ext } = parse(path);
        if (!['.js', '.mjs', '.cjs'].includes(ext))
            throw new Error(`${path} is not a JS file`);

        const event = await readJSFile(path);
        if (!(event instanceof Event))
            throw new TypeError(
                `Expected instance of Event for ${path}, recieved ${typeof event}`,
            );

        if (event.options.disabled) return;

        this.addPath(path);
        this.add(event);

        return event;
    }

    async loadDirectory(path: string) {
        const paths = await readdirJSFiles(path);
        const events = [];

        for (const { path, data: event } of paths) {
            if (!(event instanceof Event))
                throw new TypeError(
                    `Expected instance of Event for ${path}, recieved ${typeof event}`,
                );

            if (event.options.disabled) continue;

            this.addPath(path);
            this.add(event);

            events.push(event);
        }

        return events;
    }
}
