import 'dotenv/config.js';
import { JellyCommands, loadCommands, loadEvents } from 'jellycommands';
import { Intents } from 'discord.js';
import pog from './commands/pog.js';

const client = new JellyCommands({
    commands: [pog, ...(await loadCommands('commands'))],
    events: await loadEvents('events'),

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
