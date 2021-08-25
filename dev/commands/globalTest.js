import { createCommand } from 'jellycommands';

export default createCommand('guildtest', {
    description: 'A testing command bound to global',

    global: true,

    run: ({ interaction }) =>
        interaction.reply({ embeds: [{ description: 'global test' }] }),
});
