import { config } from 'dotenv';
config({ path: 'dev/.env' });

import { jellyCommands } from 'jellycommands';
import { Intents } from 'discord.js';

(async () => {
    const client = await jellyCommands({
        commands: 'dev/commands',

        clientOptions: {
            intents: [Intents.FLAGS.GUILDS],
        },
    });

    client.on('ready', () => console.log('Online'));

    client.login();
})();
