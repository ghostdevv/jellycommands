import { messageCommand } from 'jellycommands';

export default messageCommand('test', {
    guilds: ['663140687591768074'],

    run: ({ interaction }) => {
        interaction.reply({ content: 'Hello World :o' });
    },
});
