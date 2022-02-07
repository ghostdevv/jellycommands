import type { BaseCommand } from './commands/base/BaseCommand';
import { getAuthDetails, cleanToken } from '../util/token.js';
import { CommandManager } from './commands/CommandManager';
import type { JellyCommandsOptions } from './options';
import { EventManager } from './events/EventManager';
import { resolveStructures } from '../util/fs';
import type { Event } from './events/Event';
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

    async login(potentialToken?: string) {
        if (potentialToken) this.token = cleanToken(potentialToken);

        if (this.joptions.commands) {
            const commands = await resolveStructures<BaseCommand>(
                this.joptions.commands,
            );

            const commandIdMap = await CommandManager.createCommandIdMap(
                this,
                commands,
            );

            const commandManager = new CommandManager(this, commandIdMap);

            this.on('interactionCreate', (i) => {
                this.debug(`Interaction received: ${i.id} | ${i.type}`);

                // Tell command manager to respond to this
                commandManager.respond(i);
            });
        }

        if (this.joptions?.events) {
            const events = await resolveStructures<InstanceType<typeof Event>>(
                this.joptions.events,
            );

            await EventManager.loadEvents(this, events);
        }

        const { token } = getAuthDetails(this);
        return super.login(token);
    }

    debug(message: string) {
        if (this.joptions.debug)
            console.debug(`\x1b[1m\x1b[35m[DEBUG]\x1b[22m\x1b[39m ${message}`);
    }
}
