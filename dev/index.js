import { config } from 'dotenv';
config({ path: 'dev/.env' });

import { Client } from 'discord.js';
import { JellyCommands } from 'jellycommands';

const client = new Client();
const jelly = new JellyCommands(client, {});

jelly.events.load('dev/events');
jelly.commands.load('dev/commands');

client.login(process.env.TOKEN);
