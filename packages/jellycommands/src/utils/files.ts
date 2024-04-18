import { readdir } from 'node:fs/promises';
import { pathToFileURL } from 'url';
import { join } from 'node:path';

// Takes in file/folder paths and T and will resolve all to T
// When T is found callback is called
export async function read<T>(things: string | Array<string | T>, callback: (item: T) => void) {
    const thingsArray = Array.isArray(things) ? things : [things];

    for (const item of thingsArray) {
        if (typeof item != 'string') {
            callback(item);
            continue;
        }

        for (const file of await readdir(item, { recursive: true, withFileTypes: true })) {
            if (file.isDirectory()) continue;

            const path = join(file.path, file.name);
            const name = file.name;

            // If it starts with an _ we ignore it
            if (name.startsWith('_')) continue;

            // Import the file
            const data = await import(pathToFileURL(path).href);

            // Call add with the default export
            callback(data.default);
        }
    }
}
