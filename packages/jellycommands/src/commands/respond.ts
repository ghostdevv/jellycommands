import { Command } from './types/commands/Command';
import { JellyCommands } from '../JellyCommands';
import { Interaction } from 'discord.js';
import { CommandIDMap } from './types';

export interface CommandReponseData {
    client: JellyCommands;
    interaction: Interaction;
    commandIdMap: CommandIDMap;
}

export async function respond(data: CommandReponseData): Promise<void> {
    const { client, interaction, commandIdMap } = data;

    const isCommandOrAutocomplete =
        interaction.isCommand() ||
        interaction.isContextMenuCommand() ||
        interaction.isAutocomplete();

    if (!isCommandOrAutocomplete) return;

    const command = commandIdMap.get(interaction.commandId);

    // If command is not found return - if unknownCommand message send
    if (!command)
        return void (
            !interaction.isAutocomplete() &&
            client.joptions.messages?.unknownCommand &&
            interaction.reply(client.joptions.messages.unknownCommand)
        );

    const options = command.options;

    // If autocomplete interaction, run options.autocomplete
    if (interaction.isAutocomplete()) {
        if (command instanceof Command)
            await command.autocomplete?.({
                interaction,
                client,
            });

        return;
    }

    // If defer, defer
    if (options.defer)
        await interaction.deferReply(typeof options.defer == 'object' ? options.defer : {});

    // Run the command
    try {
        await command.run({ client, interaction, props: client.props });
    } catch (e) {
        console.error(
            `There was an error running command ${command.options.name}`,
            `interaction: ${interaction.id}, channel: ${interaction.channel}, guild: ${interaction.guild}`,
            e,
        );
    }
}
