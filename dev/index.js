import { Client } from 'discord.js';
import { JellyCommands } from 'jellycommands';

const client = new Client();
const jelly = new JellyCommands(client, {});

client.login();
