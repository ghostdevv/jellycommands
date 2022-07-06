import { command } from 'jellycommands';

export default command({
    name: 'guildtest',
    description: 'A testing command bound to guild not global',

    guilds: [process.env['TEST_GUILD']],

    dev: true,

    guards: {
        permissions: ['ADMINISTRATOR'],
    },

    run: ({ interaction }) =>
        interaction.reply({ embeds: [{ description: 'as' }] }),
});
