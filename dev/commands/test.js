import { createCommand } from 'jellycommands';

export default createCommand('test', {
    allowDM: false,

    run: ({ message }) => {
        message.reply('Hello World');
    },
});
