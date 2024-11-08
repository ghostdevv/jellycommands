import { describe, expect, it } from 'vitest';

describe.skip('read', () => {});

// import { describe, expect, it } from 'vitest';
// import { read } from '$src/utils/files';
// import { join } from 'desm';

// const TEST_FILES = join(import.meta.url, './test-files');

// async function readToArray<T>(things: string | Array<string | T>) {
//     const data: T[] = [];

//     await read(things, (item) => {
//         data.push(item);
//     });

//     return data;
// }

// describe('reads files and parses data', () => {
//     it('reads files', async () => {
//         const files = await readToArray(TEST_FILES);
//         expect(files).toHaveLength(3);
//     });

//     it('works with array of items', async () => {
//         const files = await readToArray([TEST_FILES]);
//         expect(files);
//     });

//     it('can read individual files', async () => {
//         const files = await readToArray(join(import.meta.url, './test-files/index.mjs'));
//         expect(files).toHaveLength(1);
//         expect(files[0]).toBe('correct');
//     });

//     it('works with multiple paths', async () => {
//         const files = await readToArray([
//             join(import.meta.url, './test-files/index.mjs'),
//             join(import.meta.url, './test-files/nested'),
//         ]);

//         expect(files).toHaveLength(2);
//     });

//     it('ignores files with _ in name', async () => {
//         const files = await readToArray([
//             TEST_FILES,
//             join(import.meta.url, './test-files/nested/_ignored.mjs'),
//         ]);

//         expect(files).not.includes('WRONG');
//         expect(files).toHaveLength(3);
//     });

//     it('returns already read items', async () => {
//         const now = Date.now();
//         const files = await readToArray<string | number>([now, TEST_FILES]);

//         expect(files).include(now);
//     });
// });
