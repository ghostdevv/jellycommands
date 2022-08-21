# The Basics

Once you have your command files loaded, you can start writing them.

## Setup

You can use the `event` utility function to create an event, for example:

```js
import { event } from 'jellycommands';

export default event({
    name: 'ready',
    
    run: () => {
        // Do something with event
    }
})
```

[You can view a list of all the event options here](/api/events#options)

### Run function

The run function will first return the context and then all the variables that event gives you. You can find what variables are given to you by that event on the [events section of the Client page](https://discord.js.org/#/docs/discord.js/main/class/Client).
For example if we take the [`channelUpdate`](https://discord.js.org/#/docs/discord.js/main/class/Client?scrollTo=e-channelUpdate) event the docs tell us this information:

![channelUpdate docs page screenshot](/events-run.png)

We can then create the following event handler:

```js
import { event } from 'jellycommands';

export default event({
    name: 'channelUpdate',
    
    run: (context, oldChannel, newChannel) => {
        // Do something with event
    }
})
```

### Context

The context object has the following properties:

#### client

- Type: `JellyCommands`

Your JellyCommands client
