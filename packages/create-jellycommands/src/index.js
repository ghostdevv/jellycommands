import { existsSync, readdirSync } from 'fs';
import { resolve, basename } from 'path';
import minimist from 'minimist';
import { join } from 'desm';
import kleur from 'kleur';
import cpy from 'cpy';

import {
	intro,
	confirm,
	cancel,
	isCancel,
	spinner,
	outro,
} from '@clack/prompts';

function exit() {
	cancel('create-jellycommands exited');
	process.exit(0);
}

export async function run() {
	const args = minimist(process.argv.slice(2));

	intro(kleur.magenta(`create-jellycommands ${kleur.bold('v1')}`));

	const rawTarget = args._[0];

	// If no directory specified as first arg
	if (!rawTarget) {
		const shouldContinue = await confirm({
			message: 'No directory specified, create in current directory?',
			initialValue: false,
		});

		if (!shouldContinue || isCancel(shouldContinue)) {
			exit();
		}
	}

	const target = resolve(rawTarget || '.');

	if (existsSync(target) && readdirSync(target).length > 0) {
		const shouldContinue = await confirm({
			message: `Directory "${basename(target)}" is ${kleur.bold('not')} empty, continue?`,
			initialValue: false,
		});

		if (!shouldContinue || isCancel(shouldContinue)) {
			exit();
		}
	}

	const useTypeScript = await confirm({
		message: `Would you like to use ${kleur.blue('TypeScript')}?`,
		initialValue: true,
	});

	if (isCancel(useTypeScript)) {
		exit();
	}

	const s = spinner();

	s.start('Copying your template');

	const templateGlob = join(
		import.meta.url,
		useTypeScript ? 'ts' : 'js',
		'/**',
	);

	await cpy(templateGlob, target, {
		rename: (basename) =>
			basename.startsWith('_') ? `.${basename.slice(1)}` : basename,
	});

	s.stop('Copied!');

	outro(kleur.green('Your project has been created!'));

	console.log(kleur.underline('To get started:'));

	const numbered = [
		rawTarget && `cd ${rawTarget}`,
		'cp .env.example .env',
		'npm install (or pnpm/yarn)',
		'npm run dev',
	];

	numbered
		.filter(Boolean)
		.forEach((item, index) =>
			console.log(`  ${kleur.gray(index + 1)}) ${item}`),
		);
}
