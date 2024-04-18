import { readdir } from 'node:fs/promises';
import { pathToFileURL } from 'url';
import { join } from 'node:path';

interface File {
    path: string;
    name: string;
}

async function readdirRecursive(path: string): Promise<File[]> {
    const results = await readdir(path, { withFileTypes: true });
    const files: File[] = [];

    for (const result of results) {
        const resultPath = join(path, result.name);

        if (result.isDirectory()) {
            files.push(...(await readdirRecursive(resultPath)));
        } else {
            files.push({ path: resultPath, name: result.name });
        }
    }

    return files;
}

// Takes in file/folder paths and T and will resolve all to T
// When T is found callback is called
export async function read<T>(things: string | Array<string | T>, callback: (item: T) => void) {
    const thingsArray = Array.isArray(things) ? things : [things];

    for (const item of thingsArray) {
        if (typeof item != 'string') {
            callback(item);
            continue;
        }

        for (const { path, name } of await readdirRecursive(item)) {
            // If it starts with an _ we ignore it
            if (name.startsWith('_')) continue;

            // Import the file
            const data = await import(pathToFileURL(path).href);

            // Call add with the default export
            callback(data.default);
        }
    }
}
