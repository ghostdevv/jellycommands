import { readdirRecursive } from 'ghoststools';
import { resolve, parse } from 'path';

// If there is a default it returns it, if there is a default but other properties it strips the default
export const resolveImport = (imp: { default?: any }) => {
    imp = Object.assign({}, imp);

    if (imp.default && Object.keys(imp).length == 1) return imp.default;

    delete imp.default;
    return imp;
};

export const readJSFile = async (path: string) => {
    const data = await import(resolve(path));
    return resolveImport(data);
};

export const readdirJSFiles = async (path: string) => {
    const files = readdirRecursive(path);
    const mapped = [];

    for (const path of files) {
        const { ext } = parse(path);
        if (!['.js', '.mjs', '.cjs'].includes(ext)) continue;

        const data = await readJSFile(path);

        mapped.push({
            path,
            data,
        });
    }

    return mapped;
};
