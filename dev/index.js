import { config } from 'dotenv';
config({ path: 'dev/.env' });

import { Client, Intents } from 'discord.js';
import { JellyCommands } from 'jellycommands';

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const jelly = new JellyCommands(client, {
    prefix: '-',

    messages: {
        unknownCommand: undefined,
    },
});

jelly.events.load('dev/events');
jelly.commands.load('dev/commands');

client.login(process.env.TOKEN);
