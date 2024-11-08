---
title: Buttons
---

## Loading

-   Guide: [/guide/buttons](/guide/buttons/files)

## Button File

A button file uses the `button` helper function and exports it. For example:

```js
import { button } from 'jellycommands';

export default button({
	id: 'hello',

	run: async ({ interaction }) => {
		await interaction.reply({
			content: 'Hello there!',
		});
	},
});
```

## Options

### id

-   Type: `string | RegExp | Awaitable<() => boolean>`

The `customId` of the button, or a regex/function to match the id to.

### run

-   Type: `Function`
-   Guide: [/guide/buttons/files#button-run-handler](/guide/buttons/files#button-run-handler)
-   Required

The main handler for the button

### defer

-   Type: `boolean | InteractionDeferReplyOptions`

Should the interaction be defered

### disabled

-   Type: `boolean`

When true JellyCommands will ignore this button.

:::note
When using file-loaded commands, you can get the same behavior by adding an `_` in front of the file.
:::
