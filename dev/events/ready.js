import { createEvent } from 'jellycommands';

export default createEvent('ready', {
    once: true,

    run: () => {
        console.log('Online');
    },
});
