import { event } from 'jellycommands';

export default event({
    name: 'ready',

    once: true,

    run: () => {
        console.log('Online');
    },
});
