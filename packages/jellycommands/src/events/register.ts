import { JellyCommands } from '../JellyCommands';
import { Event } from './Event';

export const registerEvent = async (client: JellyCommands, event: Event<any>) => {
    async function cb(...ctx: any[]) {
        try {
            await event.run({ client, props: client.props }, ...ctx);
        } catch (error) {
            console.error(`There was an error running event ${event.name}`, error);
        }
    }

    event.options.once ? client.once(event.name, cb) : client.on(event.name, cb);
};
