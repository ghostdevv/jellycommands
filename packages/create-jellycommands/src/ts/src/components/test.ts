import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { command } from 'jellycommands';

export default command({
	name: 'test',
	description: 'Testing that the bot works fine',

	global: true,

	run: ({ interaction }) => {
		const row = new ActionRowBuilder<ButtonBuilder>();

		const button = new ButtonBuilder()
			.setCustomId('hello')
			.setLabel('Click me!')
			.setStyle(ButtonStyle.Primary);

		row.addComponents(button);

		interaction.reply({
			content: 'Hello, world!',
			components: [row],
		});
	},
});
