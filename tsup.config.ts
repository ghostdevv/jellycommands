import type { Options } from 'tsup';

export const tsup: Options = {
    clean: true,
    dts: true,
    splitting: false,
    target: 'es2020',
    format: ['cjs', 'esm'],
    entryPoints: ['src/core/index.ts', 'src/events/index.ts'],
};
