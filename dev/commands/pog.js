import { command } from 'jellycommands';

export default command({
    name: 'pog',
    description: 'champ',

    global: true,

    dev: true,

    run: ({ interaction }) =>
        interaction.reply({
            embeds: [{ description: '🔥🔥🔥🔥 CCChaaaaammmmpppppp 🔥🔥🔥🔥' }],
        }),
});
