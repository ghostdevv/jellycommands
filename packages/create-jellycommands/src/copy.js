import { cp, rename, readdir } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Copy a directory to a new location.
 * Files that bein with _ will have it replaced with a period.
 *
 * @param {string} from - The source directory path.
 * @param {string} to - The destination directory path.
 */
export async function copy(from, to) {
	await cp(from, to, { recursive: true });

	const files = await readdir(to, {
		withFileTypes: true,
		recursive: true,
	});

	for (const file of files) {
		if (file.name.startsWith('_')) {
			await rename(
				join(file.parentPath, file.name),
				join(file.parentPath, `.${file.name.slice(1)}`),
			);
		}
	}
}
