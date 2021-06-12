export const defaults = {
    // Ignore messages from other discord bots
    ignoreBots: true,

    // Prefix Settings
    defaultPrefix: '?',
    perGuildPrefix: false,
};

export const validate = (options: JellyCommandsOptions) =>
    Object.entries(options).forEach(([key, value]) => {
        // @ts-ignore
        const item = defaults[key];

        if (!item) throw new Error(`Unkown option ${key}`);

        if (typeof value !== typeof item)
            throw new TypeError(
                `Expected type ${typeof item} for ${key}, recieved ${typeof value}`,
            );
    });

export interface JellyCommandsOptions {
    ignoreBots?: boolean;
    defaultPrefix?: string;
    perGuildPrefix?: string;
}
