# Guards

Guards are a built-in way of protecting commands.

:::tip NOTE
At the moment, we use Discord's permissions system. We'd like to support local guards in the future!
:::

## Permissions

You can specify which users are permitted to use a command by referencing their guild permissions. These can be accessed with [`guards.permissions`](/api/commands#guards).

```js
import { command } from 'jellycommands';

export default command({
	name: 'commandname',
	description: 'A short description of what the command does',

	guards: {
		// This means only people with the Administrator permission can use the command
		permissions: ['Administrator'],
	},

	run: ({ interaction }) => {
		// Do something with interaction
	},
});
```
