import { readdirSync, lstatSync } from 'fs';
import { resolve, join, parse } from 'path';
import Joi from 'joi';

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

const defaults = {
    name: '',
    disabled: false,
    once: false,
};
const schema = Joi.object({
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
const createEvent = (name, data) => ({ name, ...data });

export { EventManager, createEvent };
