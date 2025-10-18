#!/usr/bin/env node
import { checkForUpdate } from './version.js';
import { intro, note } from '@clack/prompts';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { run } from './index.js';
import k from 'kleur';

const dir = dirname(fileURLToPath(import.meta.url));
const pkg = await readFile(join(dir, '../package.json'), 'utf-8');
const currentVersion = JSON.parse(pkg).version;
const update = await checkForUpdate(currentVersion);

// prettier-ignore
intro(`${k.bold(k.magenta('create-jellycommands'))} ${k.dim(`v${currentVersion}`)} ${update?.available ? `=> ${k.reset(k.green(`v${update.version}`))} ${k.dim('(Update Available)')}`: ''}`);

await run();
