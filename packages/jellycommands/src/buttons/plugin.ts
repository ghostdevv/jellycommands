import { defineComponentPlugin } from '../plugins/plugins';
import type { Button } from './buttons';

export const BUTTONS_COMPONENT_ID = 'jellycommands.button';

// TODO test this function
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

export const buttonsPlugin = defineComponentPlugin<Button>(BUTTONS_COMPONENT_ID, {
    register(client, buttons) {
        client.on('interactionCreate', async (interaction) => {
            if (interaction.isButton()) {
                const button = await findButton(interaction.customId, buttons);

                if (button) {
                    if (button.options.defer) {
                        await interaction.deferReply(
                            typeof button.options.defer == 'object' ? button.options.defer : {},
                        );
                    }

                    await button.run({ client, props: client.props, interaction });
                }
            }
        });
    },
});
