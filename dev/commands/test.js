import { createCommand } from 'jellycommands';

export default createCommand('test', {
    allowDM: false,

    run: () => {
        console.log('hello');
    },
});
