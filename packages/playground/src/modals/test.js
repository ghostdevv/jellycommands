import { modal } from 'jellycommands';

export default modal({
	id: 'test',

	async run({ interaction }) {
		interaction.reply({
			content: `Hello, ${interaction.fields.getTextInputValue('nameInput')}`,
		});
	},
});
