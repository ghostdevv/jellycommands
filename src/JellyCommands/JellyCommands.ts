import type { JellyCommandsOptions } from './options';
import { CommandManager } from './commands/Manager';
import { Client } from 'discord.js';
import { schema } from './options';

interface TokenClientId {
    token: string;
    clientId: string;
}

export class JellyCommands extends Client {
    public readonly joptions: JellyCommandsOptions;

    constructor(options: JellyCommandsOptions) {
        super(options.clientOptions);

        const { error, value } = schema.validate(options);

        if (error) throw error.annotate();
        else this.joptions = value;
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

    getAuthDetails(known?: Partial<TokenClientId>): TokenClientId {
        const clientId = known?.clientId || this.resolveClientId();
        const token = known?.token || this.resolveToken();

        if (!token) throw new Error('No token found');
        if (!clientId) throw new Error('Invalid token provided');

        return { token: this.cleanToken(token) as string, clientId };
    }

    async login(potentialToken?: string) {
        const { token } = this.getAuthDetails({
            token: potentialToken,
        });

        this.token = token;

        if (this.joptions.commands) {
            const commandManager = await CommandManager.create(
                this,
                this.joptions.commands,
            );

            this.on('interactionCreate', (interaction) => {
                interaction.isCommand() && commandManager.respond(interaction);
            });
        }

        return super.login(this.resolveToken() || undefined);
    }
}
