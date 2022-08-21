# Events

## Loading

- API: [/api/client#events](/api/client#events)
- Guide: [/guide/events](/guide/events) 

## Event File

A event file uses the `event` helper function and exports it on the default export. For example:

```js
import { event } from 'jellycommands';

export default event({
    name: 'ready',

    run: () => {
        console.log('Online');
    },
});
```

## Options

### name

- Type: [`Event`](https://discord.js.org/#/docs/main/stable/class/Client)

This is the name of an event, for example `ready` or `messageCreate`

### once

- Type: `boolean`

When true this event handler will only be ran once

### disabled

- Type: `boolean`

When true JellyCommands will ignore this command.

:::tip NOTE
When using file-loaded commands, you can get the same behavior by adding an `_` in front of the file.
:::
