import { basename } from 'path';
import { totalist } from 'totalist';
import { pathToFileURL } from 'url';

// Takes in file/folder paths and T and will resolve all to T
// When T is found callback is called
export async function read<T>(things: string | Array<string | T>, callback: (item: T) => void) {
    const thingsArray = Array.isArray(things) ? things : [things];

    for (const item of thingsArray) {
        if (typeof item != 'string') {
            callback(item);
            continue;
        }

        await totalist(item, async (relPath, rawPath) => {
            const name = basename(relPath);

            // If it starts with an _ we ignore it
            if (name.startsWith('_')) return;

            // Windows needs a file url
            const { href: path } = pathToFileURL(rawPath);

            // Import the file
            const data = await import(path);

            // Call add with the default export
            callback(data.default);
        });
    }
}
