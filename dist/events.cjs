'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs');
var path = require('path');
var Joi = require('joi');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () {
                        return e[k];
                    }
                });
            }
        });
    }
    n['default'] = e;
    return Object.freeze(n);
}

var Joi__default = /*#__PURE__*/_interopDefaultLegacy(Joi);

const posixify = (path) => path.replace(/\\/g, '/');
const readdirRecursiveSync = (path$1) => fs.readdirSync(path$1)
    .map((file) => path.join(path$1, file))
    .reduce((files, file) => [
    ...files,
    ...(fs.lstatSync(file).isDirectory()
        ? readdirRecursiveSync(file)
        : [file]),
], [])
    .map((p) => path.resolve(p))
    .map((p) => posixify(p));
const resolveImport = (imp) => {
    imp = Object.assign({}, imp);
    if (imp.default && Object.keys(imp).length == 1)
        return imp.default;
    delete imp.default;
    return imp;
};
const readJSFile = async (path$1) => {
    const data = await Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require(path.resolve(path$1))); });
    return resolveImport(data);
};
const readdirJSFiles = async (path$1) => {
    const files = readdirRecursiveSync(path$1);
    const mapped = [];
    for (const path$1 of files) {
        const { ext } = path.parse(path$1);
        if (!['.js', '.mjs', '.cjs'].includes(ext))
            continue;
        const data = await readJSFile(path$1);
        mapped.push({
            path: path$1,
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
const schema = Joi__default['default'].object({
    name: Joi__default['default'].string().required(),
    disabled: Joi__default['default'].bool().required(),
    once: Joi__default['default'].bool().required(),
    run: Joi__default['default'].func().required(),
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
        const isDirectory = fs.lstatSync(path).isDirectory();
        return isDirectory ? this.loadDirectory(path) : this.loadFile(path);
    }
    async loadFile(path$1) {
        const { ext } = path.parse(path$1);
        if (!['.js', '.mjs'].includes(ext))
            throw new Error(`${path$1} is not a JS file`);
        const data = await readJSFile(path$1);
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
            filePath: path$1,
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

exports.EventManager = EventManager;
exports.createEvent = createEvent;
