import { isFeature, type Feature } from './features';
import { basename, extname, join, resolve } from 'node:path';
import { JellyCommands } from '../JellyCommands';
import { readdir, stat } from 'node:fs/promises';
import { SetMap } from '../structures/SetMap';
import { pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';

interface File {
    absolutePath: string;
    name: string;
}

// todo should ignore parent dirs with _?
// todo test

/**
 * Reads the given `path`, will gracefully handle a file
 * if one is given as the `path` arg. Ignores directories that
 * start with `_`.
 */
async function read(client: JellyCommands, path: string): Promise<File[]> {
    const extensions = client.joptions.fs!.extensions!;
    const exists = existsSync(path);

    if (!exists) {
        client.log.warn(`Given features path doesn't exist: "${path}"`);
        return [];
    }

    const isDirectory = (await stat(path)).isDirectory();
    const files: File[] = [];

    function addFile(absolutePath: string, name: string) {
        if (name.startsWith('_')) {
            if (!isDirectory) {
                client.log.warn(`Given features path starts with _ and will be ignored: "${path}"`);
            }

            return;
        }

        if (extensions.includes(extname(name))) {
            files.push({ absolutePath, name });
        }
    }

    if (isDirectory) {
        const ls = await readdir(path, {
            withFileTypes: true,
            recursive: true,
        });

        for (const file of ls) {
            if (!file.isDirectory()) {
                addFile(join(file.parentPath, file.name), file.name);
            }
        }
    } else {
        addFile(path, basename(path));
    }

    return files;
}

/**
 * The features of your bot. For any strings that are passed they
 * will be loaded recursively from that path.
 *
 * @see https://jellycommands.dev/guide/features
 */
export type LoadableFeatures = string | (string | Feature)[];

/**
 * Load all features, can take in feature instances or paths to recursively load.
 */
export async function loadFeatures(client: JellyCommands, input: LoadableFeatures) {
    const inputArray = Array.isArray(input) ? input : [input];
    const featuresById = new SetMap<string, Feature>();

    // @ts-expect-error temporarily privated
    const plugins = client.plugins;

    async function addFeature(feature: Feature) {
        for (const plugin of plugins.transforms) {
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
        const plugin = plugins.features.get(id);

        if (!plugin) {
            throw new Error(`Unable to find feature plugin for "${id}"`);
        }

        await plugin.register(client, features);
    }
}
