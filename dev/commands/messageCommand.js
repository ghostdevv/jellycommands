import { messageCommand } from 'jellycommands';

export default messageCommand({
    name: 'test',

    guilds: ['663140687591768074'],

    run: ({ interaction }) => {
        interaction.reply({ content: 'Hello World :o' });
    },
});
