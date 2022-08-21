import 'dotenv/config';
import { JellyCommands } from 'jellycommands';
import { IntentsBitField } from 'discord.js';

const client = new JellyCommands({
    // https://jellycommands.dev/guide/commands/loading
    commands: 'src/commands',

    // https://jellycommands.dev/guide/events/loading
    events: 'src/events',

    clientOptions: {
        intents: [IntentsBitField.Flags.Guilds],
    },

    dev: {
        // In testing we should enable this, it will make all our commands register in our testing guild
        // https://jellycommands.dev/guide/commands/dev#global-dev-mode
        global: true,

        // Put your testing guild id here
        // https://jellycommands.dev/guide/commands/dev#setup
        guilds: [''],
    },
});

// Automatically reads the DISCORD_TOKEN environment variable
client.login();
