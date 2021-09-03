import { config } from 'dotenv';
config({ path: 'dev/.env' });

import { JellyCommands } from 'jellycommands';
import { Intents } from 'discord.js';

const client = new JellyCommands({
    // commands: 'dev/commands',
    events: 'dev/events',

    clientOptions: {
        intents: [Intents.FLAGS.GUILDS],
    },
});

client.login();
