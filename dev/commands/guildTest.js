import { createCommand } from 'jellycommands';

export default createCommand('guildtest', {
    description: 'A testing command bound to guild not global',

    guilds: ['663140687591768074'],

    run: ({ interaction }) =>
        interaction.reply({ embeds: [{ description: 'as' }] }),
});
