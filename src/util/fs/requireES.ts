const req = require('esm')(module);
export const requireES = (path: string) => {
    const data = req(path);

    if (typeof data != 'object')
        throw new TypeError(`Expected object for ${path}`);

    return data.default && Object.keys(data).length == 1
        ? { ...data.default }
        : data;
};
