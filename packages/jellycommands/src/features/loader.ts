import { isFeature, type Feature } from './features';
import { JellyCommands } from '../JellyCommands';
import { readdir, stat } from 'node:fs/promises';
import { SetMap } from '../structures/SetMap';
import path, { basename, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';

interface File {
    absolutePath: string;
    name: string;
}

// todo check is abs
// todo should ignore parent dirs with _?
// todo test

/**
 * Reads the given `path`, will gracefully handle a file
 * if one is given as the `path` arg.
 */
async function read(client: JellyCommands, path: string): Promise<File[]> {
    const exists = existsSync(path);

    if (!exists) {
        client.log.warn(`Given features path doesn't exist: "${path}"`);
        return [];
    }

    const stats = await stat(path);
    const files: File[] = [];

    if (stats.isDirectory()) {
        const ls = await readdir(path, {
            withFileTypes: true,
            recursive: true,
        });

        for (const file of ls) {
            if (file.isDirectory() || file.name.startsWith('_')) continue;

            files.push({
                absolutePath: join(file.parentPath, file.name),
                name: file.name,
            });
        }
    } else {
        const name = basename(path);

        if (name.startsWith('_')) {
            client.log.warn(`Given features path starts with _ and will be ignored: "${path}"`);
        } else {
            files.push({ absolutePath: path, name: basename(path) });
        }
    }

    return files;
}

/**
 * The features of your bot. For any strings that are passed they
 * will be loaded recursively from that path.
 * @see todo
 */
export type LoadableFeatures = string | (string | Feature)[];

/**
 * Load all features, can take in feature instances or paths to recursively load.
 */
export async function loadFeatures(client: JellyCommands, input: LoadableFeatures) {
    const inputArray = Array.isArray(input) ? input : [input];
    const featuresById = new SetMap<string, Feature>();

    async function addFeature(feature: Feature) {
        for (const plugin of client.plugins.transforms) {
            feature = await plugin.transform(client, feature);
        }

        // todo this should really work dynamically somehow
        // todo should this be a feature attrib rather than an option?
        // should options be locked and attribs dynamic
        // should disabled be a fn?
        if (feature.options.disabled) {
            return;
        }

        featuresById.set(feature.id, feature);
    }

    for (const pathOrFeature of inputArray) {
        if (typeof pathOrFeature != 'string') {
            if (isFeature(pathOrFeature)) {
                await addFeature(pathOrFeature);
            } else {
                // todo better log message
                client.log.warn('A given features item is not a feature or path');
            }

            continue;
        }

        const files = await read(client, resolve(pathOrFeature));

        if (files.length == 0) {
            client.log.warn('Found no features at a given path:', pathOrFeature);
        }

        for (const file of files) {
            // Import the module, we need a file url here because of windows
            const mod = await import(pathToFileURL(file.absolutePath).href);

            // Find all the valid feature exports and load them
            for (const maybeFeature of Object.values(mod)) {
                if (isFeature(maybeFeature)) {
                    await addFeature(maybeFeature);
                }
            }
        }
    }

    for (const [id, features] of featuresById.entries()) {
        const plugin = client.plugins.features.get(id);

        if (!plugin) {
            throw new Error(`Unable to find feature plugin for "${id}"`);
        }

        await plugin.register(client, features);
    }
}
