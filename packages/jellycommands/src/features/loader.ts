import { isFeature, type Feature } from './features';
import { existsSync, statSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { pathToFileURL } from 'node:url';

/**
 * The features of your bot. For any strings that are passed they
 * will be loaded recursively from that path.
 * @see todo
 */
export type LoadableFeatures = string | (string | Feature)[];

/**
 * Load all features, can take in feature instances or paths to recursively load.
 */
export async function loadFeatures(
    input: LoadableFeatures,
    callback: (feature: Feature) => Promise<void>,
) {
    const features = Array.isArray(input) ? input : [input];
    const callbacks: Promise<void>[] = [];

    async function handle(filePath: string, name = basename(filePath)) {
        // If it starts with an _ we ignore it
        if (name.startsWith('_')) return;

        // Import the module, we need a file url here because of windows
        const mod = await import(pathToFileURL(filePath).href);

        // Find all the valid feature exports and load them
        for (const maybeFeature in Object.values(mod)) {
            if (isFeature(maybeFeature)) {
                callbacks.push(callback(maybeFeature));
            }
        }
    }

    for (const pathOrFeature of features) {
        if (typeof pathOrFeature != 'string') {
            callbacks.push(callback(pathOrFeature));
            continue;
        }

        if (existsSync(pathOrFeature) && statSync(pathOrFeature).isFile()) {
            await handle(pathOrFeature);
            continue;
        }

        const ls = await readdir(pathOrFeature, {
            withFileTypes: true,
            recursive: true,
        });

        for (const file of ls) {
            if (file.isDirectory()) continue;
            await handle(join(file.path, file.name), file.name);
        }
    }

    await Promise.all(callbacks);
}
