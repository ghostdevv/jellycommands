import { command } from 'jellycommands';

export default command({
    name: 'test',
    description: 'Testing that the bot works fine',

    global: true,

    run: ({ interaction }) => {
        interaction.reply({
            content: 'Hello, world!',
        });
    },
});
