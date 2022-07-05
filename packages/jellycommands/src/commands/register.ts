import { RESTPutAPIApplicationCommandPermissionsJSONBody } from 'discord-api-types/v9';
import { APIApplicationCommand, Routes } from 'discord-api-types/v9';
import { CommandIDMap, ResolvedCommands } from './types';
import { JellyCommands } from '../JellyCommands';
import { createRequest } from '../utils/request';
import { getAuthDetails } from '../utils/token';

export const registerCommands = async (
    client: JellyCommands,
    { globalCommands, guildCommands }: ResolvedCommands,
) => {
    const { clientId, token } = getAuthDetails(client);
    const request = createRequest(token);

    const globalCommandsArray = Array.from(globalCommands);

    const commandIdMap: CommandIDMap = new Map();

    // Register global commands
    const registeredGlobalCommands = await request<APIApplicationCommand[]>(
        'put',
        Routes.applicationCommands(clientId),
        globalCommandsArray.map((c) => c.applicationCommandData),
    );

    // Map returned command ids to their corresponding command
    registeredGlobalCommands.forEach((command, i) =>
        commandIdMap.set(command.id, globalCommandsArray[i]),
    );

    for (const [guildId, commands] of guildCommands) {
        const commandsArray = Array.from(commands);

        // Register commands for the guild
        const res = await request<APIApplicationCommand[]>(
            'put',
            Routes.applicationGuildCommands(clientId, guildId),
            commandsArray.map((c) => c.applicationCommandData),
        );

        res.forEach((command, i) =>
            commandIdMap.set(command.id, commandsArray[i]),
        );
    }

    return commandIdMap;
};
