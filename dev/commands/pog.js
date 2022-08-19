import { ApplicationCommandOptionType } from 'discord.js';
import { command } from 'jellycommands';

export default command({
    name: 'pog',
    description: 'champ',

    global: true,

    options: [
        {
            type: ApplicationCommandOptionType.Channel,
            name: 'channel',
            description: 'Channel to pog',
            required: true,
        },
    ],

    dev: true,
    dm: false,

    run: ({ interaction }) =>
        interaction.reply({
            embeds: [{ description: '🔥🔥🔥🔥 CCChaaaaammmmpppppp 🔥🔥🔥🔥' }],
        }),
});
