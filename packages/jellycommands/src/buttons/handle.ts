import type { JellyCommands } from '../JellyCommands';
import type { ButtonInteraction } from 'discord.js';
import type { Button } from './buttons';

async function findButton(incomingId: string, buttons: Set<Button>): Promise<Button | null> {
    for (const button of buttons) {
        const { id } = button.options;

        switch (typeof id) {
            case 'string':
                if (id == incomingId) return button;
                break;

            case 'function':
                if (await id(incomingId)) return button;
                break;

            case 'object':
                if (id.test(incomingId)) return button;
                break;
        }
    }

    return null;
}

export async function handleButton({
    client,
    interaction,
    buttons,
}: {
    client: JellyCommands;
    interaction: ButtonInteraction;
    buttons: Set<Button>;
}) {
    const button = await findButton(interaction.customId, buttons);

    if (button) {
        if (button.options.defer)
            await interaction.deferReply(
                typeof button.options.defer == 'object' ? button.options.defer : {},
            );

        await button.run({ client, props: client.props, interaction });
    }
}
