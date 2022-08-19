import { ApplicationCommandOptionType } from 'discord.js';
import { command } from 'jellycommands';
import { colors } from './_colors.js';

export default command({
    name: 'rainbow',
    description: 'send a rainbow',

    global: true,

    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: 'color',
            description: 'The color of the thing idk',
            required: true,
            autocomplete: true,
        },
    ],

    dev: true,

    run: ({ interaction }) => interaction.reply(interaction.options.getString('color', true)),

    autocomplete: async ({ interaction }) => {
        const focused = interaction.options.getFocused(true);

        if (focused.name === 'color') {
            interaction.respond(
                colors
                    .filter((color) => color.startsWith(focused.value))
                    .map((color) => ({ name: color, value: color }))
                    .slice(0, 10),
            );
        }
    },
});
