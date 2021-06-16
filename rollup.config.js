import typescript from '@rollup/plugin-typescript';

const exports = ['core', 'events'];

export default exports.map((exp) => ({
    input: `src/${exp}/index.ts`,
    external: ['fs', 'path', 'joi'],
    output: [
        {
            file: `dist/${exp}.cjs`,
            format: 'cjs',
        },
        {
            file: `dist/${exp}.mjs`,
            format: 'esm',
        },
    ],
    plugins: [typescript()],
}));
