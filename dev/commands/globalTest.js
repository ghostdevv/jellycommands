import { command } from 'jellycommands';

export default command('globaltest', {
    description: 'A testing command bound to global',

    global: true,

    run: ({ interaction }) =>
        interaction.reply({ embeds: [{ description: 'global test' }] }),
});
