import type { Options } from 'tsup';

export const tsup: Options = {
    splitting: false,
    sourcemap: false,
    clean: true,
    dts: true,
    target: 'node12',
    keepNames: true,
    format: ['esm', 'cjs'],
    entryPoints: ['src/index.ts'],
};
