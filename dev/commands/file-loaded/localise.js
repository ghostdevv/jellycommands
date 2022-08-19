import { ApplicationCommandOptionType } from 'discord.js';
import { command } from 'jellycommands';

export default command({
    name: 'localised',
    description: 'testing localisations',

    nameLocalizations: {
        de: 'spiel',
    },

    descriptionLocalizations: {
        de: 'wir spielen',
    },

    options: [
        {
            name: 'play',
            type: ApplicationCommandOptionType.String,
            nameLocalizations: {
                de: 'speil',
            },
            description: 'play',
            descriptionLocalizations: {
                de: 'wir spielen',
            },
        },
    ],

    global: true,

    run: ({ interaction }) => {
        console.log({ locale: interaction.locale, glocale: interaction.guildLocale });
        interaction.reply({ embeds: [{ description: 'global test' }] });
    },
});
