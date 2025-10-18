// Based on MIT Licensed code from Deno
// https://github.com/denoland/std/blob/b8959a59f3843dbd4520a97662a1230e97dc953d/semver
// https://github.com/denoland/std/blob/b8959a59f3843dbd4520a97662a1230e97dc953d/LICENSE

/**
 * @typedef SemVer
 * @property {number} major
 * @property {number} minor
 * @property {number} patch
 * @property {(string | number)[]=} prerelease
 * @property {string[]=} build
 */

/**
 * @param {SemVer} version1
 * @param {SemVer} version2
 * @returns {1 | 0 | -1}
 */
export function compare(version1, version2) {
	if (version1 === version2) return 0;
	return (
		compareNumber(version1.major, version2.major) ||
		compareNumber(version1.minor, version2.minor) ||
		compareNumber(version1.patch, version2.patch) ||
		checkIdentifier(version1.prerelease, version2.prerelease) ||
		compareIdentifier(version1.prerelease, version2.prerelease)
	);
}

const MAX_LENGTH = 256;

const NUMERIC_IDENTIFIER = '0|[1-9]\\d*';
const NON_NUMERIC_IDENTIFIER = '\\d*[a-zA-Z-][a-zA-Z0-9-]*';
const VERSION_CORE = `(?<major>${NUMERIC_IDENTIFIER})\\.(?<minor>${NUMERIC_IDENTIFIER})\\.(?<patch>${NUMERIC_IDENTIFIER})`;
const PRERELEASE_IDENTIFIER = `(?:${NUMERIC_IDENTIFIER}|${NON_NUMERIC_IDENTIFIER})`;
const PRERELEASE = `(?:-(?<prerelease>${PRERELEASE_IDENTIFIER}(?:\\.${PRERELEASE_IDENTIFIER})*))`;
const BUILD_IDENTIFIER = '[0-9A-Za-z-]+';
const BUILD = `(?:\\+(?<buildmetadata>${BUILD_IDENTIFIER}(?:\\.${BUILD_IDENTIFIER})*))`;
const FULL_VERSION = `v?${VERSION_CORE}${PRERELEASE}?${BUILD}?`;
const FULL_REGEXP = new RegExp(`^${FULL_VERSION}$`);

/**
 * @param {string} value
 * @returns {SemVer}
 */
export function parse(value) {
	if (typeof value !== 'string') {
		throw new TypeError(
			`Cannot parse version as version must be a string: received ${typeof value}`,
		);
	}

	if (value.length > MAX_LENGTH) {
		throw new TypeError(
			`Cannot parse version as version length is too long: length is ${value.length}, max length is ${MAX_LENGTH}`,
		);
	}

	// biome-ignore lint/style/noParameterAssign:
	value = value.trim();

	const groups = value.match(FULL_REGEXP)?.groups;
	if (!groups) throw new TypeError(`Cannot parse version: ${value}`);

	const major = parseNumber(
		groups.major,
		`Cannot parse version ${value}: invalid major version`,
	);
	const minor = parseNumber(
		groups.minor,
		`Cannot parse version ${value}: invalid minor version`,
	);
	const patch = parseNumber(
		groups.patch,
		`Cannot parse version ${value}: invalid patch version`,
	);

	const prerelease = groups.prerelease
		? parsePrerelease(groups.prerelease)
		: [];
	const build = groups.buildmetadata ? parseBuild(groups.buildmetadata) : [];

	return { major, minor, patch, prerelease, build };
}

const NUMERIC_IDENTIFIER_REGEXP = new RegExp(`^${NUMERIC_IDENTIFIER}$`);

/**
 * @param {string} prerelease
 */
function parsePrerelease(prerelease) {
	return prerelease
		.split('.')
		.filter(Boolean)
		.map((id) => {
			if (NUMERIC_IDENTIFIER_REGEXP.test(id)) {
				const number = Number(id);
				if (isValidNumber(number)) return number;
			}
			return id;
		});
}

/**
 * @param {string} buildmetadata
 */
function parseBuild(buildmetadata) {
	return buildmetadata.split('.').filter(Boolean);
}

/**
 * @param {string} input
 * @param {string} errorMessage
 * @returns
 */
function parseNumber(input, errorMessage) {
	const number = Number(input);
	if (!isValidNumber(number)) throw new TypeError(errorMessage);
	return number;
}

/**
 *
 * @param {unknown} value
 * @returns {value is number}
 */
function isValidNumber(value) {
	return (
		typeof value === 'number' &&
		!Number.isNaN(value) &&
		(!Number.isFinite(value) ||
			(0 <= value && value <= Number.MAX_SAFE_INTEGER))
	);
}

/**
 * @param {number} a
 * @param {number} b
 * @returns {1 | 0 | -1}
 */
function compareNumber(a, b) {
	if (Number.isNaN(a) || Number.isNaN(b)) {
		throw new Error('Cannot compare against non-numbers');
	}
	return a === b ? 0 : a < b ? -1 : 1;
}

/**
 * @param {ReadonlyArray<string | number>} v1
 * @param {ReadonlyArray<string | number>} v2
 * @returns {1 | 0 | -1}
 */
function checkIdentifier(v1 = [], v2 = []) {
	// NOT having a prerelease is > having one
	// But NOT having a build is < having one
	if (v1.length && !v2.length) return -1;
	if (!v1.length && v2.length) return 1;
	return 0;
}

/**
 * @param {ReadonlyArray<string | number>} v1
 * @param {ReadonlyArray<string | number>} v2
 * @returns {1 | 0 | -1}
 */
function compareIdentifier(v1 = [], v2 = []) {
	const length = Math.max(v1.length, v2.length);
	for (let i = 0; i < length; i++) {
		const a = v1[i];
		const b = v2[i];
		// same length is equal
		if (a === undefined && b === undefined) return 0;
		// longer > shorter
		if (b === undefined) return 1;
		// shorter < longer
		if (a === undefined) return -1;
		// string > number
		if (typeof a === 'string' && typeof b === 'number') return 1;
		// number < string
		if (typeof a === 'number' && typeof b === 'string') return -1;
		if (a < b) return -1;
		if (a > b) return 1;
		// If they're equal, continue comparing segments.
	}
	return 0;
}
