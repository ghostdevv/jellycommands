import { readdirJSFiles, readJSFile } from '../util/fs';
import { defaults, schema } from './options';
import { lstatSync } from 'fs';
import { parse } from 'path';
export class EventManager {
    constructor(jelly) {
        this.jelly = jelly;
        this.client = jelly.client;
    }
    add(name, data) {
        const cb = (...ctx) => data.run(...ctx, { client: this.client, jelly: this.jelly });
        if (data.once)
            this.client.once(name, cb);
        else
            this.client.on(name, cb);
    }
    load(path) {
        const isDirectory = lstatSync(path).isDirectory();
        return isDirectory ? this.loadDirectory(path) : this.loadFile(path);
    }
    async loadFile(path) {
        const { ext } = parse(path);
        if (!['.js', '.mjs'].includes(ext))
            throw new Error(`${path} is not a JS file`);
        const data = await readJSFile(path);
        const { error, value } = schema.validate(Object.assign(defaults, data));
        if (value.disabled)
            return;
        if (error)
            throw error.annotate();
        else
            this.add(value.name, value);
        return {
            name: data.name,
            once: data.once,
            disabled: data.disabled,
            filePath: path,
        };
    }
    async loadDirectory(path) {
        const paths = await readdirJSFiles(path);
        for (const { data } of paths) {
            const { error, value } = schema.validate(Object.assign(defaults, data));
            if (value.disabled)
                continue;
            if (error)
                throw error.annotate();
            else
                this.add(value.name, value);
        }
        return paths.map(({ path, data }) => ({
            name: data.name,
            once: data.once,
            disabled: data.disabled,
            filePath: path,
        }));
    }
}
export const createEvent = (name, data) => ({ name, ...data });
