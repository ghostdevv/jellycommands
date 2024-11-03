import { readdir } from 'node:fs/promises';
import { pathToFileURL } from 'url';
import { basename, join } from 'node:path';
import { existsSync, statSync } from 'node:fs';

// Takes in file/folder paths and T and will resolve all to T
// When T is found callback is called
export async function read<T>(things: string | Array<string | T>, callback: (item: T) => void) {
    const thingsArray = Array.isArray(things) ? things : [things];

    async function handle(filePath: string, name = basename(filePath)) {
        // If it starts with an _ we ignore it
        if (name.startsWith('_')) return;

        // Import the file, we need a file url here because of windows
        const data = await import(pathToFileURL(filePath).href);

        // Run the callback
        callback(data.default);
    }

    for (const pathOrThing of thingsArray) {
        if (typeof pathOrThing != 'string') {
            callback(pathOrThing);
            continue;
        }

        if (existsSync(pathOrThing) && statSync(pathOrThing).isFile()) {
            await handle(pathOrThing);
            continue;
        }

        const ls = await readdir(pathOrThing, {
            recursive: true,
            withFileTypes: true,
        });

        for (const file of ls) {
            if (file.isDirectory()) continue;
            await handle(join(file.path, file.name), file.name);
        }
    }
}
