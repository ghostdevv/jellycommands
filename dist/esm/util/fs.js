import { readdirSync, lstatSync } from 'fs';
import { join, resolve, parse } from 'path';
export const posixify = (path) => path.replace(/\\/g, '/');
export const readdirRecursiveSync = (path) => readdirSync(path)
    .map((file) => join(path, file))
    .reduce((files, file) => [
    ...files,
    ...(lstatSync(file).isDirectory()
        ? readdirRecursiveSync(file)
        : [file]),
], [])
    .map((p) => resolve(p))
    .map((p) => posixify(p));
export const readJSFile = async (path) => {
    const data = await import(resolve(path));
    return data.default && Object.keys(data).length == 1
        ? { ...data.default }
        : data;
};
export const readdirJSFiles = async (path) => {
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
