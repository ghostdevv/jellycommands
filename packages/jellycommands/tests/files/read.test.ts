import { read } from '../../src/utils/files';
import { notEqual, ok } from 'assert';
import { join } from 'desm';
import { test } from 'uvu';

const TEST_FILES = join(import.meta.url, './test-files');

test('can read files', async () => {
    const data: string[] = [];

    await read<string>(TEST_FILES, (item) => {
        data.push(item);
    });

    notEqual(data.length, 0);
});

test('ignores files with _ in name', async () => {
    const data: string[] = [];

    await read<string>(TEST_FILES, (item) => {
        data.push(item);
    });

    ok(!data.includes('WRONG'));
});

test.run();
