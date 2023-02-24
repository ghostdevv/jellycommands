import 'dotenv/config.js';
import { JellyCommands } from 'jellycommands';
import { IntentsBitField } from 'discord.js';
import ready from './events/ready.js';
import pog from './commands/pog.js';

const client = new JellyCommands({
    // For testing loading commands by importing we have a file-loaded dir for each
    commands: [pog, 'commands/file-loaded'],
    events: [ready, 'events/file-loaded'],

    clientOptions: {
        intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages],
    },

    dev: {
        global: true,
        guilds: [process.env['TEST_GUILD']],
    },

    debug: true,

    props: {
        test: 'asd',
    },
});

client.login();
