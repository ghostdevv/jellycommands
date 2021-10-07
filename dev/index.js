import { config } from 'dotenv';
config({ path: 'dev/.env' });

import { JellyCommands } from 'jellycommands';
import { Intents } from 'discord.js';

const client = new JellyCommands({
    commands: 'dev/commands',
    events: 'dev/events',

    clientOptions: {
        intents: [Intents.FLAGS.GUILDS],
    },

    messages: {
        unknownCommand: {
            embeds: [{ description: 'Unknown Command', color: 'RANDOM' }],
        },
    },

    dev: {
        guilds: ['663140687591768074'],
    },

    debug: true,
});

client.login();
