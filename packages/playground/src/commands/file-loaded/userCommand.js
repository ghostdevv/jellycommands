import { userCommand } from 'jellycommands';

export default userCommand({
	name: 'Hello World',

	global: true,

	dev: true,

	run: ({ interaction }) => {
		interaction.reply({ content: `Hello ${interaction.user.tag}` });
	},
});
