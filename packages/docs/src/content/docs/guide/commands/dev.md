---
title: Dev Mode
---

**Global** slash commands take _up to an hour_ to register, so it's recommended to use **guild** commands during development.

`JellyCommands` has a `dev` mode to make this easy.

## Setup

To use `dev` mode, you must tell `Jelly` which `guilds` to use.

```js
const client = new JellyCommands({
	dev: {
		guilds: ['663140687591768074'], // Array of guild id's
	},
});
```

For additional options, see [dev options](/api/client#dev).

:::note
If `dev` mode is enabled, at least one guild id must be specified within [`dev.guilds`](/api/client#dev)
:::

## Global Dev Mode

Adding `dev: true` to every command _(and remembering to remove it)_ can be tedious. [global dev mode](/api/client#dev) makes this easier.

Enable global dev mode by setting `global` to true.

```js
const client = new JellyCommands({
	dev: {
		global: true, // This will enable dev mode on every command
		guilds: ['663140687591768074'],
	},
});
```

### Automatic Global Dev Mode

An **environment variable** can be used to automatically enable dev mode locally with the popular `dotenv` package.

In your project's root directory, create a file called `.env` containing the text `NODE_ENV="development"`. Then, add the following to your config:

```js
import 'dotenv/config'; // Reads environment variables from a .env file
import { Client } from 'jellycommands';

const DEV = process.env['NODE_ENV'] == 'development';

const client = new JellyCommands({
	dev: {
		global: DEV,
		guilds: ['663140687591768074'],
	},
});
```

Now, `dev` mode will be enabled when working locally, and disabled when running in production.

## Dev Mode for Commands

<!-- You can also enable `dev` mode for individual commands. You should also set `global` to true so that when out of `dev` mode, the command is still registered globally. -->

You can also enable `dev` mode for individual commands.

:::note
You should also set `global` to true so the command is still registered globally when out of `dev` mode.
:::

```js
import { command } from 'jellycommands';

export default command({
	name: 'commandname',
	description: 'A short description of what the command does',

	global: true,
	dev: true,

	run: ({ interaction }) => {
		// Do something with interaction
	},
});
```
