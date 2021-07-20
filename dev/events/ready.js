import { createEvent } from 'jellycommands';

export default createEvent('guildMemberAdd', {
    once: true,

    run: () => {
        console.log('Online');
    },
});
