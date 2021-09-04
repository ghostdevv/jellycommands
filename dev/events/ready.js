import { event } from 'jellycommands';

export default event('ready', {
    once: true,

    run: () => {
        console.log('Online');
    },
});
