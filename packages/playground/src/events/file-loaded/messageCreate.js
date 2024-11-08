import { event } from 'jellycommands';

export default event({
	name: 'messageCreate',

	once: false,

	run: () => {
		console.log('10-4');
	},
});
