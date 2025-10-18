import { event } from 'jellycommands';

export default event({
	name: 'clientReady',
	run: (_, client) => console.log(client.user.tag, 'is online!'),
});
