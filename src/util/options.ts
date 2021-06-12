export const merge = <T>(base: T, options: T): T => {
    for (const [key, value] of Object.entries(options)) {
        // @ts-ignore
        const baseItem = base[key];

        if (!baseItem) throw new Error(`Unknown option ${key}`);

        if (typeof value !== typeof baseItem)
            throw new TypeError(
                `Expected type ${typeof baseItem} for ${key}, recieved ${typeof value}`,
            );

        // @ts-ignore
        base[key] = value;
    }

    return base;
};
