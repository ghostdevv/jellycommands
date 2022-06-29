import { castToArray, flattenPaths } from 'ghoststools';
import { pathToFileURL } from 'url';
import { existsSync } from 'fs';
import { resolve } from 'path';

async function importItem<T>(path: string): Promise<T> {
    const data = await import(pathToFileURL(resolve(path)).href);
    return data.default;
}

async function readPath<T>(path: string): Promise<T[]> {
    if (!existsSync(path)) throw new Error(`Unable to find path "${path}"`);

    const filePaths = flattenPaths(path, {
        filter: (f) => !f.startsWith('_'),
    });

    const promises: Promise<T>[] = [];

    for (const filePath of filePaths) {
        promises.push(importItem(filePath));
    }

    return Promise.all(promises);
}

export async function resolveItems<T>(data: string | Array<string | T>) {
    const items = new Set<T>();

    for (const item of castToArray(data)) {
        if (typeof item == 'string') {
            for (const found of await readPath<T>(item)) {
                items.add(found);
            }
        } else {
            items.add(item);
        }
    }

    return items;
}
