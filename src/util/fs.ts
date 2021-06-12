import { readdirSync, lstatSync } from 'fs';
import { join, resolve, parse } from 'path';

export const posixify = (path: string) => path.replace(/\\/g, '/');

export const readdirRecursiveSync = (path: string): string[] =>
    readdirSync(path)
        .map((file) => join(path, file))
        .reduce(
            (files: string[], file: string) => [
                ...files,
                ...(lstatSync(file).isDirectory()
                    ? readdirRecursiveSync(file)
                    : [file]),
            ],
            [],
        )
        .map((p) => resolve(p))
        .map((p) => posixify(p));

const req = require('esm')(module);
export const requireES = (path: string) => {
    const data = req(path);

    if (typeof data != 'object')
        throw new TypeError(`Expected object for ${path}`);

    return data.default && Object.keys(data).length == 1
        ? { ...data.default }
        : data;
};

export const isDisabled = (path: string) => parse(path).name.startsWith('_');
export const isJsFile = (path: string) =>
    ['.js', '.mjs'].includes(parse(path).ext);
