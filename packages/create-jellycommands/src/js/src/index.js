import 'dotenv/config';
import { JellyCommands } from 'jellycommands';
import { Intents } from 'discord.js';

const client = new JellyCommands({
    // https://ghostdevbusiness.gitbook.io/jellycommands/commands/loading-commands
    commands: 'src/commands',

    // https://ghostdevbusiness.gitbook.io/jellycommands/events/loading-events
    events: 'src/events',

    clientOptions: {
        intents: [Intents.FLAGS.GUILDS],
    },

    dev: {
        // In testing we should enable this, it will make all our commands register in our testing guild
        // https://ghostdevbusiness.gitbook.io/jellycommands/commands/dev-mode#global-dev-mode
        global: true,

        // Put your testing guild id here
        // https://ghostdevbusiness.gitbook.io/jellycommands/commands/dev-mode#setting-dev-guilds
        guilds: [''],
    },
});

// Automatically reads the DISCORD_TOKEN environment variable
client.login();
