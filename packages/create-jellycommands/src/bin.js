#!/usr/bin/env node
import { checkForUpdate } from './version.js';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { intro } from '@clack/prompts';
import { run } from './index.js';
import pc from 'picocolors';

const dir = dirname(fileURLToPath(import.meta.url));
const pkg = await readFile(join(dir, '../package.json'), 'utf-8');
const currentVersion = JSON.parse(pkg).version;
const update = await checkForUpdate(currentVersion);

// prettier-ignore
intro(`${pc.bold(pc.magenta('create-jellycommands'))} ${pc.dim(`v${currentVersion}`)} ${update?.available ? `=> ${pc.reset(pc.green(`v${update.version}`))} ${pc.dim('(Update Available)')}`: ''}`);

await run();
