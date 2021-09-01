import { command } from 'jellycommands';

export default command('pog', {
    description: 'champ',

    guilds: ['663140687591768074'],

    run: ({ interaction }) =>
        interaction.reply({
            embeds: [
                { description: '🔥🔥🔥🔥 CCChaaaaaammmmmpppppppp 🔥🔥🔥🔥' },
            ],
        }),
});
