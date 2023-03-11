import { ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';
import { command } from 'jellycommands';

export default command({
    name: 'testbutton',
    description: 'Test the buttons',

    global: true,
    defer: true,

    async run({ interaction }) {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('test').setLabel('test').setStyle(ButtonStyle.Primary),
        );

        interaction.followUp({
            content: 'Test Buttons',
            components: [
                // @ts-ignore
                row,
            ],
        });
    },
});
