import { createSlashCommand } from 'jellycommands';

export default createSlashCommand('guildtest', {
    description: 'A testing command bound to guild not global',

    guilds: ['663140687591768074'],

    run: () => {
        console.log('Test');
    },
});
