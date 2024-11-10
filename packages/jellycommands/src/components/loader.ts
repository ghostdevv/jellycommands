import { basename, extname, join, resolve } from 'node:path';
import { isComponent, type Component } from './components';
import type { JellyCommands } from '../JellyCommands';
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
	// biome-ignore lint/style/noNonNullAssertion: has default value elsewhere
	const extensions = client.joptions.fs!.extensions!;
	const exists = existsSync(path);

	if (!exists) {
		client.log.warn(`Given components path doesn't exist: "${path}"`);
		return [];
	}

	const isDirectory = (await stat(path)).isDirectory();
	const files: File[] = [];

	function addFile(absolutePath: string, name: string) {
		if (name.startsWith('_')) {
			if (!isDirectory) {
				client.log.warn(
					`Given components path starts with _ and will be ignored: "${path}"`,
				);
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
 * The components of your bot. For any strings that are passed they
 * will be loaded recursively from that path.
 *
 * @see https://jellycommands.dev/components
 */
export type LoadableComponents = string | (string | Component)[];

/**
 * Load all components, can take in component instances or paths to recursively load.
 */
export async function loadComponents(
	client: JellyCommands,
	input: LoadableComponents,
) {
	const inputArray = Array.isArray(input) ? input : [input];
	const componentsById = new SetMap<string, Component>();

	// @ts-expect-error temporarily privated
	const plugins = client.plugins;

	async function addComponent(component: Component) {
		// todo this should really work dynamically somehow
		// todo should this be a component attrib rather than an option?
		// should options be locked and attribs dynamic
		// should disabled be a fn?
		if (component.options.disabled) {
			return;
		}

		componentsById.set(component.id, component);
	}

	for (const pathOrComponent of inputArray) {
		if (typeof pathOrComponent !== 'string') {
			if (isComponent(pathOrComponent)) {
				await addComponent(pathOrComponent);
			} else {
				// todo better log message
				client.log.warn(
					'A given components item is not a component or path',
				);
			}

			continue;
		}

		const files = await read(client, resolve(pathOrComponent));

		if (files.length === 0) {
			client.log.warn(
				'Found no components at a given path:',
				pathOrComponent,
			);
		}

		for (const file of files) {
			// Import the module, we need a file url here because of windows
			const mod = await import(pathToFileURL(file.absolutePath).href);

			// Find all the valid component exports and load them
			for (const maybeComponent of Object.values(mod)) {
				if (isComponent(maybeComponent)) {
					await addComponent(maybeComponent);
				}
			}
		}
	}

	for (const [id, components] of componentsById.entries()) {
		const plugin = plugins.components.get(id);

		if (!plugin) {
			throw new Error(`Unable to find component plugin for "${id}"`);
		}

		await plugin.register(client, components);
	}
}
