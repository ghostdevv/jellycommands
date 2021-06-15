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

// If there is a default it returns it, if there is a default but other properties it strips the default
export const resolveImport = (imp: { default?: unknown }) => {
    if (imp.default && Object.keys(imp).length == 1) return imp.default;

    delete imp.default;

    return imp;
};

export const readJSFile = async (path: string) => {
    const data = await import(resolve(path));
    return resolveImport(data);
};

export const readdirJSFiles = async (path: string) => {
    const files = readdirRecursiveSync(path);
    const mapped = [];

    for (const path of files) {
        const { ext } = parse(path);
        if (!['.js', '.mjs', '.cjs'].includes(ext)) continue;

        const data = await readJSFile(path);

        mapped.push({
            path,
            data,
        });
    }

    return mapped;
};
