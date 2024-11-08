---
title: Events
---

## Loading

-   Guide: [/guide/events](/guide/events/files)

## Event File

A event file uses the `event` helper function and exports it. For example:

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

-   Type: [`Event`](https://discord.js.org/#/docs/main/stable/class/Client)

This is the name of an event, for example `ready` or `messageCreate`

### once

-   Type: `boolean`

When true this event handler will only be ran once

### disabled

-   Type: `boolean`

When true JellyCommands will ignore this command.

:::note
When using file-loaded commands, you can get the same behavior by adding an `_` in front of the file.
:::
