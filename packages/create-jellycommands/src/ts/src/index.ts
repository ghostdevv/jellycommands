import 'dotenv/config';
import { JellyCommands } from 'jellycommands';
import { IntentsBitField } from 'discord.js';

const client = new JellyCommands({
	// https://jellycommands.dev/components
	components: 'src/components',

	clientOptions: {
		intents: [IntentsBitField.Flags.Guilds],
	},

	dev: {
		// In testing we should enable this, it will make all our commands register in our testing guild
		// https://jellycommands.dev/components/commands/dev
		global: true,

		// Put your testing guild id here
		// https://jellycommands.dev/components/commands/dev
		guilds: [''],
	},
});

// Automatically reads the DISCORD_TOKEN environment variable
client.login();
