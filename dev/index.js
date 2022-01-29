import 'dotenv/config.js';
import { JellyCommands } from 'jellycommands';
import { Intents } from 'discord.js';

const client = new JellyCommands({
    commands: 'commands',
    events: 'events',

    clientOptions: {
        intents: [Intents.FLAGS.GUILDS],
    },

    dev: {
        global: true,
        guilds: ['663140687591768074'],
    },

    debug: true,
});

client.login();
