import 'dotenv/config.js';
import { JellyCommands } from 'jellycommands';
import { Intents } from 'discord.js';
import pog from './commands/pog.js';
import ready from './events/ready.js';

const client = new JellyCommands({
    // For testing loading commands by importing we have a file-loaded dir for each
    commands: [pog, 'commands/file-loaded'],
    events: [ready, 'events/file-loaded'],

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
