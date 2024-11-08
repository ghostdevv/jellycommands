---
title: Commands
---

## Loading

-   Guide: [/guide/commands](/guide/commands/files)

## Command File

A command file uses the `command` helper function and exports it. For example:

```js
import { command } from 'jellycommands';

export default command({
	name: 'commandname',
	description: 'A short description of what the command does',

	run: ({ interaction }) => {
		// Do something with interaction
	},
});
```

## Command Types

There are 3 types of commands you can do in JellyCommands

### Slash Commands

SlashCommands are the main type of command

#### Use

You can use the `command` helper from JellyCommands, for example:

```js
import { command } from 'jellycommands';

export default command({
	name: 'commandname',
	description: 'A short description of what the command does',

	run: ({ interaction }) => {
		// Do something with interaction
	},
});
```

#### Options

This section lists extra options that a slash command has, [click here to see the core options for all commands](#core-options).

##### description

-   Type: `string`
-   Required

The name of the command

##### descriptionLocalizations

-   Type: `Partial<Record<Locale, string>>`

The localizations for users not in english, you can view the available [`Locale` options here](https://discord.js.org/#/docs/discord.js/main/typedef/Locale)

##### options

-   Type: [`ApplicationCommandOptionData[]`](https://discord.js.org/#/docs/discord.js/main/typedef/ApplicationCommandOption)
-   Guide: [/guide/commands/slash#options](/guide/commands/slash#options)

The options for the slash command

<!-- TODO document autocomplete -->

### Message Commands

Message commands are context menus available on messages

#### Use

You can use with the `messageCommand` helper, for example:

```js
import { messageCommand } from 'jellycommands';

export default messageCommand({
	name: 'test',
	global: true,

	run: ({ interaction }) => {
		interaction.reply({ content: 'Hello World' });
	},
});
```

#### Options

[Click here to view the core options](#core-options)

### User Commands

User commands are context menus available on users

#### Use

You can use with the `userCommand` helper, for example:

```js
import { userCommand } from 'jellycommands';

export default userCommand({
	name: 'test',
	global: true,

	run: ({ interaction }) => {
		interaction.reply({ content: 'Hello World' });
	},
});
```

#### Options

[Click here to view the core options](#core-options)

## Core Options

This shows options that all command types share

### name

-   Type: `string`
-   Required

The name of the command

### nameLocalizations

-   Type: `Partial<Record<Locale, string>>`

The localizations for users not in english, you can view the available [`Locale` options here](https://discord.js.org/#/docs/discord.js/main/typedef/Locale)

### dev

-   Type: `boolean`
-   Guide: [/guide/commands/dev](/guide/commands/dev)

Whether the command is in dev mode or not

### defer

-   Type: `boolean | InteractionDeferReplyOptions`

Should the interaction be defered

### guards

-   Guide: [/guide/commands/guards](/guide/commands/guards)

Guards allow you to prevent/allow access to your command

### guards.permissions

-   Type: [`PermissionResolvable`](https://discord.js.org/#/docs/discord.js/main/typedef/PermissionResolvable)

The permissions a member must have to run this command

### guilds

-   Type: `string`

The guilds to register the slash command in

### global

-   Type: `boolean`

Whether the command should be registered as a global command

### dynamic

-   Type: `boolean`
-   Default: `true`

Should the command work in DMs, this only works on global commands

### disabled

-   Type: `boolean`

When true JellyCommands will ignore this command.

:::note
When using file-loaded commands, you can get the same behavior by adding an `_` in front of the file.
:::

### run

-   Type: `Function`
-   Guide: [/guide/commands/files](/guide/commands/files)
-   Required

The main handler for the command

### autocomplete

-   Type: `Function`
-   Guide: [/guide/commands/files](/guide/commands/files)

Handles autocomplete interaction for slash commands
