import { JellyCommandsOptions, jellyCommandsOptionsSchema } from './options';
import { cleanToken, resolveToken } from './utils/token';
import { Logger, createLogger } from './utils/logger';
import { AnyCommand } from './commands/types/types';
import { loadCommands } from './commands/resolve';
import { RouteBases } from 'discord-api-types/v10';
import { type FetchOptions, ofetch } from 'ofetch';
import { loadFeatures } from './features/loader';
import { handleButton } from './buttons/handle';
import { Button } from './buttons/buttons';
import { parseSchema } from './utils/zod';
import { Event } from './events/Event';
import { Client } from 'discord.js';

export class JellyCommands extends Client {
    public readonly joptions: JellyCommandsOptions;
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

        // TODO remove for 1.0
        // Makes need for a migration more obvious for those using props api
        this.props = {
            get() {
                throw new Error(
                    'props.get has been removed, SEE: https://jellycommands.dev/guide/migrate/props.html',
                );
            },
            set() {
                throw new Error(
                    'props.set has been removed, SEE: https://jellycommands.dev/guide/migrate/props.html',
                );
            },
            has() {
                throw new Error(
                    'props.has has been removed, SEE: https://jellycommands.dev/guide/migrate/props.html',
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

    async login(potentialToken?: string): Promise<string> {
        if (potentialToken) {
            this.token = cleanToken(potentialToken);
        }

        const commands = new Set<AnyCommand>();
        const buttons = new Set<Button>();

        await loadFeatures(this.joptions.features, async (feature) => {
            if (feature.options.disabled) {
                return;
            }

            if (Event.is(feature)) {
                // todo how to replicate set dedupe for all features
                await Event.register(this, feature);
                return;
            }

            if (Button.is(feature)) {
                buttons.add(feature);
                return;
            }
        });

        if (buttons.size) {
            this.on('interactionCreate', (interaction) => {
                if (interaction.isButton()) {
                    handleButton({ client: this, interaction, buttons });
                }
            });
        }

        if (commands.size) {
            await loadCommands(this, commands);
        }

        return super.login(resolveToken(this) || undefined);
    }
}
