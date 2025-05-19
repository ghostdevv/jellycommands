import 'dotenv/config.js';
import { JellyCommands } from 'jellycommands';
import { IntentsBitField } from 'discord.js';
import ready from './events/ready.js';
import pog from './commands/pog.js';

const testGuild = process.env.TEST_GUILD;

if (typeof testGuild !== 'string') {
	throw new Error('Please add TEST_GUILD env variable');
}

const client = new JellyCommands({
	// For testing loading commands by importing we have a file-loaded dir for each
	// commands: [pog, 'src/commands/file-loaded'],
	// events: [ready, 'src/events/file-loaded'],
	// buttons: 'src/buttons',

	components: [
		pog,
		ready,
		'src/modals',
		'src/commands/file-loaded',
		'src/events/file-loaded',
		'src/buttons',
	],

	clientOptions: {
		intents: [
			IntentsBitField.Flags.Guilds,
			IntentsBitField.Flags.GuildMessages,
		],
	},

	dev: {
		global: true,
		guilds: [testGuild],
	},

	debug: true,

	props: {
		a: 'asd',
	},
});

client.login();
