import { resolve } from 'path';

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
