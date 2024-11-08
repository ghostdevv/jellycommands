import type { CommandIDMap, ResolvedCommands } from './types';
import type { JellyCommands } from '../JellyCommands';
import { registerCommands } from './register';
import { Cache } from '../structures/Cache';
import type { AnyCommand } from './types/types';

export async function getCommandIdMap(
	client: JellyCommands,
	commands: ResolvedCommands,
): Promise<CommandIDMap> {
	// If cache is disabled always register
	if (!client.joptions.cache) {
		client.log.debug('Cache Disabled, registering Commands');
		return await registerCommands(client, commands);
	}

	client.log.debug('Loading Cache');

	const idResolver = new CommandIdResolver();
	const cache = new CommandCache();

	if (cache.validate(commands.commands)) {
		client.log.debug('Cache is valid');

		// Attempt to resolve command id map
		const commandIdMap = idResolver.get(commands.commands);

		if (commandIdMap) {
			client.log.debug('Command Id Resolution success');
			return commandIdMap;
		}

		// This will only run if a CommandManager isn't returned above
		client.log.debug('Id Resolver failed, reregistering commands');
	}

	client.log.debug('Cache is invalid, registering commands');

	const commandIdMap = await registerCommands(client, commands);

	client.log.debug('Cache Updated');
	cache.set(commands.commands);

	client.log.debug('Id Resolver Updated');
	idResolver.set(commandIdMap);

	return commandIdMap;
}

export class CommandCache {
	private cache = new Cache('command-cache');

	set(commands: Set<AnyCommand>) {
		this.cache.set<string[]>(this.getHashIds(commands));
	}

	getHashIds(commands: Set<AnyCommand>) {
		const hashIds: string[] = [];

		for (const command of commands) {
			hashIds.push(command.hashId);
		}

		return hashIds;
	}

	validate(commands: Set<AnyCommand>): boolean {
		const ids = this.cache.get<string[]>();
		if (!ids || !Array.isArray(ids)) return false;

		const newIds = this.getHashIds(commands);

		// If the lengths aren't the same then they can't possibly be equal
		if (newIds.length !== ids.length) return false;

		// If a id in newIds doesn't exist in the cache then exit
		for (const id of newIds) {
			if (!ids.includes(id)) return false;
		}

		return true;
	}
}

type CommandHashId = string;
type CommandId = string;

type IdResolverMap = Record<CommandId, CommandHashId>;

export class CommandIdResolver {
	private cache = new Cache('command-id-resolver');

	set(commands: CommandIDMap) {
		const data: IdResolverMap = {};

		for (const [commandId, command] of commands) {
			data[commandId] = command.hashId;
		}

		this.cache.set<IdResolverMap>(data);
	}

	get(commands: Set<AnyCommand>): CommandIDMap | false {
		const ids = this.cache.get<IdResolverMap>();
		if (!ids) return false;

		const commandIdMap: CommandIDMap = new Map();
		const commandsArray = [...commands];

		for (const [commandId, hashId] of Object.entries(ids)) {
			const command = commandsArray.find(
				(command) => command.hashId === hashId,
			);
			if (!command) return false;

			commandIdMap.set(commandId, command);
		}

		return commandIdMap;
	}
}
