export const defaults = {
    // Ignore messages from other discord bots
    ignoreBots: true,

    // Prefix Settings
    defaultPrefix: '?',
    perGuildPrefix: false,
};

export const validate = (options: JellyCommandsOptions) => {
    for (const [key, value] of Object.entries(options)) {
        // @ts-ignore
        const item = defaults[key];

        if (!item) return [false, new Error(`Unkown option ${key}`)];

        if (typeof value !== typeof item)
            return [
                false,
                new TypeError(
                    `Expected type ${typeof item} for ${key}, recieved ${typeof value}`,
                ),
            ];
    }

    return [true, null];
};

export interface JellyCommandsOptions {
    ignoreBots?: boolean;
    defaultPrefix?: string;
    perGuildPrefix?: string;
}
