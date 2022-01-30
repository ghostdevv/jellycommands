import 'dotenv/config.js';
import { JellyCommands } from 'jellycommands';
import { Intents } from 'discord.js';
import pog from './commands/pog.js';
import ready from './events/ready.js';

const client = new JellyCommands({
    commands: [pog, 'commands/stuff'],
    events: [ready, 'events/messages'],

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
