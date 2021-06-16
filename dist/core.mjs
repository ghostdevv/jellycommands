import { readdirSync, lstatSync } from 'fs';
import { resolve, join, parse } from 'path';
import Joi from 'joi';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

const posixify = (path) => path.replace(/\\/g, '/');
const readdirRecursiveSync = (path) => readdirSync(path)
    .map((file) => join(path, file))
    .reduce((files, file) => [
    ...files,
    ...(lstatSync(file).isDirectory()
        ? readdirRecursiveSync(file)
        : [file]),
], [])
    .map((p) => resolve(p))
    .map((p) => posixify(p));
const resolveImport = (imp) => {
    imp = Object.assign({}, imp);
    if (imp.default && Object.keys(imp).length == 1)
        return imp.default;
    delete imp.default;
    return imp;
};
const readJSFile = async (path) => {
    const data = await import(resolve(path));
    return resolveImport(data);
};
const readdirJSFiles = async (path) => {
    const files = readdirRecursiveSync(path);
    const mapped = [];
    for (const path of files) {
        const { ext } = parse(path);
        if (!['.js', '.mjs', '.cjs'].includes(ext))
            continue;
        const data = await readJSFile(path);
        mapped.push({
            path,
            data,
        });
    }
    return mapped;
};

const defaults$1 = {
    name: '',
    disabled: false,
    once: false,
};
const schema$1 = Joi.object({
    name: Joi.string().required(),
    disabled: Joi.bool().required(),
    once: Joi.bool().required(),
    run: Joi.func().required(),
});

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
        const isDirectory = lstatSync(path).isDirectory();
        return isDirectory ? this.loadDirectory(path) : this.loadFile(path);
    }
    async loadFile(path) {
        const { ext } = parse(path);
        if (!['.js', '.mjs'].includes(ext))
            throw new Error(`${path} is not a JS file`);
        const data = await readJSFile(path);
        const { error, value } = schema$1.validate(Object.assign(defaults$1, data));
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
            const { error, value } = schema$1.validate(Object.assign(defaults$1, data));
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

const defaults = {
    ignoreBots: true,
    defaultPrefix: '?',
    perGuildPrefix: false,
};
const schema = Joi.object({
    ignoreBots: Joi.bool().required(),
    defaultPrefix: Joi.string().min(1).max(64).required(),
    perGuildPrefix: Joi.bool().required(),
});

var _JellyCommands_client, _JellyCommands_options;
class JellyCommands {
    constructor(client, options = {}) {
        _JellyCommands_client.set(this, void 0);
        _JellyCommands_options.set(this, void 0);
        if (!client)
            throw new SyntaxError('Expected a instance of Discord.Client, recieved none');
        __classPrivateFieldSet(this, _JellyCommands_client, client, "f");
        const { error, value } = schema.validate(Object.assign(defaults, options));
        if (error)
            throw error.annotate();
        else
            __classPrivateFieldSet(this, _JellyCommands_options, value, "f");
        this.eventManager = new EventManager(this);
    }
    get client() {
        return __classPrivateFieldGet(this, _JellyCommands_client, "f");
    }
    get options() {
        return Object.freeze({ ...__classPrivateFieldGet(this, _JellyCommands_options, "f") });
    }
    get events() {
        return this.eventManager;
    }
}
_JellyCommands_client = new WeakMap(), _JellyCommands_options = new WeakMap();

export { JellyCommands };
