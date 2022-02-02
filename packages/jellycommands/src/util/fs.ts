import { castToArray, flattenPaths } from 'ghoststools';
import { pathToFileURL } from 'url';
import { resolve } from 'path';

// If there is a default it returns it, if there is a default but other properties it strips the default
export const resolveImport = (imp: { default?: any }) => {
    if ((imp as { __esModule?: boolean }).__esModule)
        return imp.default.default;

    if (imp.default && Object.keys(imp).length == 1) return imp.default;

    return imp;
};

export const readJSFile = async <T>(path: string): Promise<T> => {
    const data = await import(pathToFileURL(resolve(path)).href);
    return resolveImport(data) as T;
};

export const readFiles = (files: string | string[]) =>
    flattenPaths(files, { filter: (f) => !f.startsWith('_') });

export async function resolveStructures<T>(
    items: string | Array<T | string>,
): Promise<T[]> {
    const resolved: T[] = [];

    for (const item of castToArray<string | T>(items)) {
        if (typeof item == 'string') {
            const files = readFiles(item);

            for (const item of files) resolved.push(await readJSFile<T>(item));
        } else {
            resolved.push(item);
        }
    }

    return resolved;
}
