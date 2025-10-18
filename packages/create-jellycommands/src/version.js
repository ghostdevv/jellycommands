import { compare, parse } from './semver.js';

/**
 * Check whether an update is available
 * @param {string} currentVersion
 */
export async function checkForUpdate(currentVersion) {
	try {
		const res = await fetch('https://npm.antfu.dev/create-jellycommands');
		const data = /** @type {{ version: string }} */ (await res.json());

		return {
			available:
				compare(parse(data.version), parse(currentVersion)) === 1,
			version: data.version,
		};
	} catch {
		return null;
	}
}
