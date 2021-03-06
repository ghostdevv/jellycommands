import { cleanToken, resolveToken } from './utils/token.js';
import { resolveCommands } from './commands/resolve';
import { getCommandIdMap } from './commands/cache';
import { registerEvents } from './events/register';
import { JellyCommandsOptions } from './options';
import { respond } from './commands/respond';
import { Props } from './structures/Props';
import { Client } from 'discord.js';
import { schema } from './options';

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

    async login(potentialToken?: string): Promise<string> {
        if (potentialToken) this.token = cleanToken(potentialToken);

        if (this.joptions.commands) {
            const commands = await resolveCommands(this, this.joptions.commands);

            const commandIdMap = await getCommandIdMap(this, commands);

            // Whenever there is a interactionCreate event respond to it
            this.on('interactionCreate', (interaction) => {
                // prettier-ignore
                this.debug(`Interaction received: ${interaction.id} | ${interaction.type} | Command Id: ${interaction.isCommand() && interaction.commandId}`);

                respond({
                    interaction,
                    client: this,
                    commandIdMap,
                });
            });
        }

        if (this.joptions?.events) {
            await registerEvents(this, this.joptions.events);
        }

        return super.login(resolveToken(this) || 'undefined');
    }

    debug(message: string) {
        if (this.joptions.debug) console.debug(`\x1b[1m\x1b[35m[DEBUG]\x1b[22m\x1b[39m ${message}`);
    }
}
