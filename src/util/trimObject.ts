export const trimObject = (object: object, toTrim: string[]) => {
    for (const item of toTrim) {
        delete (object as any)[item];
    }

    return object;
};
