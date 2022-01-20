import { CommandManager } from './commands/CommandManager';
import type { JellyCommandsOptions } from './options';
import { EventManager } from './events/EventManager';
import { Props } from './structures/Props';
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

    resolveToken(): string | null {
        return this.token || this.cleanToken(process.env?.DISCORD_TOKEN);
    }

    resolveClientId(): string | null {
        if (this.user?.id) return this.user?.id;

        const token = this.resolveToken();
        if (!token) return null;

        return Buffer.from(token.split('.')[0], 'base64').toString();
    }

    getAuthDetails(): AuthDetails {
        const clientId = this.resolveClientId();
        const token = this.resolveToken();

        if (!token) throw new Error('No token found');
        if (!clientId) throw new Error('Invalid token provided');

        return { token, clientId };
    }

    async login(potentialToken?: string) {
        if (potentialToken) this.token = this.cleanToken(potentialToken);

        const { token } = this.getAuthDetails();

        if (this.joptions.commands) {
            const commandIdMap = await CommandManager.createCommandIdMap(
                this,
                this.joptions.commands,
            );

            const commandManager = new CommandManager(this, commandIdMap);

            this.on('interactionCreate', (i) => {
                this.debug(`Interaction Recieved: ${i.id} | ${i.type}`);

                // Tell command manager to respond to this
                commandManager.respond(i);
            });
        }

        if (this.joptions?.events)
            await EventManager.loadEvents(this, this.joptions.events);

        return super.login(token);
    }

    debug(message: string) {
        if (this.joptions.debug)
            console.debug(`\x1b[1m\x1b[35m[DEBUG]\x1b[22m\x1b[39m ${message}`);
    }
}
