"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvent = exports.EventManager = void 0;
const fs_1 = require("../util/fs");
const options_1 = require("./options");
const fs_2 = require("fs");
const path_1 = require("path");
class EventManager {
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
        const isDirectory = fs_2.lstatSync(path).isDirectory();
        return isDirectory ? this.loadDirectory(path) : this.loadFile(path);
    }
    async loadFile(path) {
        const { ext } = path_1.parse(path);
        if (!['.js', '.mjs'].includes(ext))
            throw new Error(`${path} is not a JS file`);
        const data = await fs_1.readJSFile(path);
        const { error, value } = options_1.schema.validate(Object.assign(options_1.defaults, data));
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
        const paths = await fs_1.readdirJSFiles(path);
        for (const { data } of paths) {
            const { error, value } = options_1.schema.validate(Object.assign(options_1.defaults, data));
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
exports.EventManager = EventManager;
const createEvent = (name, data) => ({ name, ...data });
exports.createEvent = createEvent;
