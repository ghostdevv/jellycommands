import { command } from 'jellycommands';

export default command({
	name: 'hidden',
	description: "you shouldn't be seeing this",

	global: true,

	dev: true,

	run: ({ interaction }) =>
		interaction.reply({
			embeds: [{ description: 'Peek-a-boo!' }],
		}),
});
