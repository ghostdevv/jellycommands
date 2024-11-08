---
title: Creating Events
---

```js
import { event } from 'jellycommands';

export default event({
	name: 'ready',

	run: () => {
		// Do something with event
	},
});
```

[You can view a list of all the event options here](/api/events#options)

## `Run`

When an `event` is invoked, the event's `run` function is called. This is where your custom event logic lives.

The first variable provided by an event's `run` function will always be [`context`](/guide/events/files#context). Additional, event-specific variables are listed on the [events section](https://discord.js.org/#/docs/discord.js/main/class/Client) of the `client` page.

For example, the [`channelUpdate`](https://discord.js.org/#/docs/discord.js/main/class/Client?scrollTo=e-channelUpdate) event docs show that `channelUpdate` provides the `oldChannel` and `newChannel` variables:

![channelUpdate docs page screenshot](/events-run.png)

We can access these variables like so:

```js
import { event } from 'jellycommands';

export default event({
	name: 'channelUpdate',

	run: (context, oldChannel, newChannel) => {
		// Do something with event
	},
});
```

### Context

The context object has the following properties:

#### client [`JellyCommands`](/api/client)

The client used by the command.

#### props [`Props`](/api/props)

Your project's props.
