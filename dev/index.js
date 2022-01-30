import 'dotenv/config.js';
import { JellyCommands } from 'jellycommands';
import { Intents } from 'discord.js';
import pog from './commands/pog.js';
import ready from './events/ready.js';

const client = new JellyCommands({
    commands: [pog, 'commands/stuff'],
    events: [ready, 'events/messages'],

    clientOptions: {
        intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    },

    dev: {
        global: true,
        guilds: [process.env['TEST_GUILD']],
    },

    debug: true,
});

client.login();
