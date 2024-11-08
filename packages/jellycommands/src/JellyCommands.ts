import { type JellyCommandsOptions, jellyCommandsOptionsSchema } from './options';
import { type SortedPlugins, sortPlugins } from './plugins/plugins';
import { type Logger, createLogger } from './utils/logger';
import { cleanToken, resolveToken } from './utils/token';
import { loadComponents } from './components/loader';
import { RouteBases } from 'discord-api-types/v10';
import { type FetchOptions, ofetch } from 'ofetch';
import { CORE_PLUGINS } from './plugins/core';
import { parseSchema } from './utils/zod';
import { Client } from 'discord.js';

export class JellyCommands extends Client {
    // todo these options include data that isn't relevant (like given components) so mayb shouldn't be here
    public readonly joptions: JellyCommandsOptions;
    private readonly plugins: SortedPlugins;
    public readonly props: Props;
    public readonly log: Logger;

    constructor(options: JellyCommandsOptions) {
        super(options.clientOptions);

        // @ts-expect-error issue with intents
        this.joptions = parseSchema(
            'JellyCommands options',
            jellyCommandsOptionsSchema,
            options,
        ) as JellyCommandsOptions;

        this.log = createLogger(this);
        this.props = options.props || {};
        // this.plugins = sortPlugins(this, [...CORE_PLUGINS, ...(this.joptions.plugins || [])]);
        this.plugins = sortPlugins(this, CORE_PLUGINS);

        // TODO remove for 1.0
        // Makes need for a migration more obvious for those using props api
        this.props = {
            get() {
                throw new Error(
                    'props.get has been removed, SEE: https://jellycommands.dev/guide/migrate/props',
                );
            },
            set() {
                throw new Error(
                    'props.set has been removed, SEE: https://jellycommands.dev/guide/migrate/props',
                );
            },
            has() {
                throw new Error(
                    'props.has has been removed, SEE: https://jellycommands.dev/guide/migrate/props',
                );
            },
            ...this.props,
        };
    }

    async $fetch<R = any, D extends Record<string, any> = any, Q extends Record<string, any> = any>(
        path: string,
        options?: { method: string; body?: D; headers?: FetchOptions['headers']; query?: Q },
    ): Promise<R> {
        return await ofetch<R>(path, {
            baseURL: RouteBases.api,
            headers: {
                ...(options?.headers || {}),
                Authorization: `Bot ${this.token}`,
            },
            method: options?.method,
            body: options?.body,
            query: options?.query || undefined,
            retry: 5,
            retryDelay: 500,
            onResponseError: (context) => {
                if (context.options.retryStatusCodes?.includes(context.response.status)) {
                    // prettier-ignore
                    this.log.debug(`[Discord Request Rate Limited] Retrying in ${context.options.retryDelay}ms`)
                }

                const contextStr =
                    typeof context.response?._data == 'object'
                        ? `:\n${JSON.stringify(context.response._data, null, 2)}\n`
                        : ' NO CONTEXT RETURNED';

                this.log.error(`[Discord Fetch Error (${context.response?.status})]${contextStr}`);
            },
        });
    }

    /**
     * This must be called once in order to start your Discord Bot.
     * It initialises all JellyCommands specific code, then calls
     * the base discord.js `client.login()` fn to run your bot.
     */
    async login(potentialToken?: string): Promise<string> {
        this.token ||= cleanToken(potentialToken);
        const token = resolveToken(this);

        if (!token) {
            throw new Error('No bot token was found');
        }

        if (this.joptions.components?.length) {
            this.log.debug('Loading components');
            await loadComponents(this, this.joptions.components);
        } else {
            this.log.debug('No components given');
        }

        return super.login(token);
    }
}
