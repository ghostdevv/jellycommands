import { pathToFileURL } from 'url';
import { resolve } from 'path';

// If there is a default it returns it, if there is a default but other properties it strips the default
export const resolveImport = (imp: { default?: any }) => {
    if ((imp as { __esModule?: boolean }).__esModule)
        return imp.default.default;

    if (imp.default && Object.keys(imp).length == 1) return imp.default;

    return imp;
};

export const readJSFile = async (path: string) => {
    const data = await import(pathToFileURL(resolve(path)).href);
    return resolveImport(data);
};
