import { command } from 'jellycommands';

export default command({
	name: 'dmblockglobal',
	description: "I am a global command that shouldn't work in dm",

	global: true,
	dm: false,

	run: ({ interaction }) =>
		interaction.reply({ embeds: [{ description: 'global test' }] }),
});
