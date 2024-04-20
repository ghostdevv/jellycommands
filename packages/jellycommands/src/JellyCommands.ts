import { cleanToken, resolveToken } from './utils/token.js';
import { resolveCommands } from './commands/resolve';
import { getCommandIdMap } from './commands/cache';
import { registerEvents } from './events/register';
import { handleButton } from './buttons/handle.js';
import { JellyCommandsOptions, jellyCommandsOptionsSchema } from './options';
import { loadButtons } from './buttons/load.js';
import { respond } from './commands/respond';
import { Client } from 'discord.js';
import { parseSchema } from './utils/zod.js';

export class JellyCommands extends Client {
    public readonly joptions: JellyCommandsOptions;
    public readonly props: Props;

    constructor(options: JellyCommandsOptions) {
        super(options.clientOptions);

        // @ts-expect-error issue with intents
        this.joptions = parseSchema(
            'JellyCommands options',
            jellyCommandsOptionsSchema,
            options,
        ) as JellyCommandsOptions;

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

    async login(potentialToken?: string): Promise<string> {
        if (potentialToken) {
            this.token = cleanToken(potentialToken);
        }

        if (this.joptions.commands) {
            const commands = await resolveCommands(this, this.joptions.commands);
            const commandIdMap = await getCommandIdMap(this, commands);

            if (!this.joptions.dev?.guilds?.length) {
                const hasDevCommand = Array.from(commands.commands).some(
                    (command) => command.options.dev,
                );

                // If dev is enabled in some way, make sure they have at least one guild id
                if (this.joptions.dev?.global || hasDevCommand)
                    throw new Error(
                        'You must provide at least one guild id in the dev guilds array to use dev commands',
                    );
            }

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

        if (this.joptions.buttons) {
            const buttons = await loadButtons(this.joptions.buttons);

            this.on('interactionCreate', (interaction) => {
                if (interaction.isButton()) {
                    handleButton({ client: this, interaction, buttons });
                }
            });
        }

        if (this.joptions?.events) {
            await registerEvents(this, this.joptions.events);
        }

        return super.login(resolveToken(this) || undefined);
    }

    debug(message: string) {
        if (this.joptions.debug) {
            console.debug(`\x1b[1m\x1b[35m[DEBUG]\x1b[22m\x1b[39m ${message}`);
        }
    }
}
