import { messageCommand } from 'jellycommands';

export default messageCommand({
	name: 'test',

	global: true,

	dev: true,

	run: ({ interaction }) => {
		interaction.reply({ content: 'Hello World :o' });
	},
});
