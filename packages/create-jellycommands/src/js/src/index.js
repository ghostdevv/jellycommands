import 'dotenv/config';
import { JellyCommands } from 'jellycommands';
import { Intents } from 'discord.js';

const client = new JellyCommands({
    commands: 'src/commands',
    events: 'src/events',

    clientOptions: {
        intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS],
    },

    dev: {
        // Put your testing guild id here
        guilds: [''],
    },
});

// Auto reads the DISCORD_TOKEN environment variable
client.login();
