import type { GuildCommands, GlobalCommands } from './types.d';
import { defineComponentPlugin } from '../plugins/plugins';
import type { JellyCommands } from '../JellyCommands';
import type { AnyCommand } from './types/types';
import { getCommandIdMap } from './cache';
import { respond } from './respond';

async function sortCommands(client: JellyCommands, commands: Set<AnyCommand>) {
	const globalCommands: GlobalCommands = new Set();
	const guildCommands: GuildCommands = new Map();

	for (const command of commands) {
		// if (command.options.disabled) {
		//     commands.delete(command);
		//     continue;
		// }

		const devMode = client.joptions.dev?.global || command.options.dev;
		const devGuilds = client.joptions.dev?.guilds || [];

		if (devMode) {
			command.options.dev = true;
			command.options.global = false;
			command.options.guilds = devGuilds;
		}

		if (command.options.global) {
			globalCommands.add(command);
		}

		if (command.options.guilds) {
			for (const guildId of command.options.guilds) {
				const existing = guildCommands.get(guildId) || new Set();

				existing.add(command);
				guildCommands.set(guildId, existing);
			}
		}
	}

	return {
		guildCommands,
		globalCommands,
		commands,
	};
}

export const COMMAND_COMPONENT_ID = 'jellycommands.command';

export const commandsPlugin = defineComponentPlugin<AnyCommand>(
	COMMAND_COMPONENT_ID,
	{
		async register(client, _commands) {
			const commands = await sortCommands(client, _commands);
			const commandIdMap = await getCommandIdMap(client, commands);

			if (!client.joptions.dev?.guilds?.length) {
				const hasDevCommand = Array.from(commands.commands).some(
					(command) => command.options.dev,
				);

				// If dev is enabled in some way, make sure they have at least one guild id
				if (client.joptions.dev?.global || hasDevCommand) {
					throw new Error(
						'You must provide at least one guild id in the dev guilds array to use dev commands',
					);
				}
			}

			// Whenever there is a interactionCreate event respond to it
			client.on('interactionCreate', (interaction) => {
				// prettier-ignore
				client.log.debug(`Interaction received: ${interaction.id} | ${interaction.type} | Command Id: ${interaction.isCommand() && interaction.commandId}`);

				respond({
					interaction,
					client,
					commandIdMap,
				});
			});
		},
	},
);
