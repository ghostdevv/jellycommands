export default {
    // Ignore messages from other discord bots
    ignoreBots: true,

    // Prefix Settings
    defaultPrefix: '?',
    perGuildPrefix: false
}

export interface JellyCommandsOptions {
    ignoreBots?: boolean,
    defaultPrefix?: string,
    perGuildPrefix?: string
}