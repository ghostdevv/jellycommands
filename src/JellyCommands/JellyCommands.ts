import { ApplicationCommandManager } from './applicationCommands/ApplicationCommandManager';
import type { JellyCommandsOptions } from './options';
import { EventManager } from './events/EventManager';
import { Props } from './props/Props';
import { Client } from 'discord.js';
import { schema } from './options';

interface AuthDetails {
    token: string;
    clientId: string;
}

export class JellyCommands extends Client {
    public readonly joptions: JellyCommandsOptions;
    public readonly props: Props;

    constructor(options: JellyCommandsOptions) {
        super(options.clientOptions);

        const { error, value } = schema.validate(options);

        if (error) throw error.annotate();
        else this.joptions = value;

        this.props = new Props(options.props);
    }

    cleanToken(token?: string): string | null {
        return typeof token == 'string'
            ? token.replace(/^(Bot|Bearer)\s*/i, '')
            : null;
    }

    resolveToken(token?: string): string | null {
        return this.cleanToken(
            token || this.token || process.env?.DISCORD_TOKEN,
        );
    }

    resolveClientId(): string | null {
        if (this.user?.id) return this.user?.id;

        const token = this.resolveToken();
        if (!token) return null;

        return Buffer.from(token.split('.')[0], 'base64').toString();
    }

    getAuthDetails(known?: Partial<AuthDetails>): AuthDetails {
        const clientId = known?.clientId || this.resolveClientId();
        const token = known?.token || this.resolveToken();

        if (!token) throw new Error('No token found');
        if (!clientId) throw new Error('Invalid token provided');

        return { token, clientId };
    }

    async login(potentialToken?: string) {
        const { token } = this.getAuthDetails({
            token: this.cleanToken(potentialToken) || undefined,
        });

        this.token = token;

        if (this.joptions.commands) {
            const applicationCommandManager =
                await ApplicationCommandManager.create(
                    this,
                    this.joptions.commands,
                );

            this.on('interactionCreate', (i) =>
                applicationCommandManager.respond(i),
            );
        }

        if (this.joptions?.events)
            await EventManager.loadEvents(this, this.joptions.events);

        return super.login(token);
    }
}
