import {
	TextInputBuilder,
	TextInputStyle,
	ModalBuilder,
	ActionRowBuilder,
} from 'discord.js';
import { command } from 'jellycommands';

export default command({
	name: 'test-modal',
	description: 'Shows a modal with a text input',

	global: true,

	async run({ interaction }) {
		// Create a text input component with the builder
		const nameInput = new TextInputBuilder()
			.setCustomId('nameInput')
			.setLabel('Whats your name?')
			.setStyle(TextInputStyle.Short);

		// All components need to be in a "row"
		const row = /** @type {ActionRowBuilder<TextInputBuilder>} */ (
			new ActionRowBuilder()
		).addComponents(nameInput);

		// Create the actual modal
		const modal = new ModalBuilder()
			.setCustomId('test')
			.setTitle('Whats Your Name?')
			.addComponents(row);

		// Send the modal
		interaction.showModal(modal);
	},
});
