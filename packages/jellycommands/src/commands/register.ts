import { type APIApplicationCommand, Routes } from 'discord-api-types/v10';
import type { CommandIDMap, ResolvedCommands } from './types';
import { JellyCommands } from '../JellyCommands';
import { getAuthData } from '../utils/token';

export const registerCommands = async (
    client: JellyCommands,
    { globalCommands, guildCommands }: ResolvedCommands,
) => {
    const globalCommandsArray = Array.from(globalCommands);
    const commandIdMap: CommandIDMap = new Map();
    const { clientId } = getAuthData(client);

    // Register global commands
    const registeredGlobalCommands = await client.$fetch<APIApplicationCommand[]>(
        Routes.applicationCommands(clientId),
        { method: 'PUT', body: globalCommandsArray.map((c) => c.applicationCommandData) },
    );

    // Map returned command ids to their corresponding command
    registeredGlobalCommands.forEach((command, i) =>
        commandIdMap.set(command.id, globalCommandsArray[i]),
    );

    for (const [guildId, commands] of guildCommands) {
        const commandsArray = Array.from(commands);

        // Register commands for the guild
        const res = await client.$fetch<APIApplicationCommand[]>(
            Routes.applicationGuildCommands(clientId, guildId),
            { method: 'PUT', body: commandsArray.map((c) => c.applicationCommandData) },
        );

        res.forEach((command, i) => commandIdMap.set(command.id, commandsArray[i]));
    }

    return commandIdMap;
};
