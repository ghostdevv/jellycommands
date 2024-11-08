# Messages

`messages` are used to customise `JellyCommands` responses.

## Unknown Command

If `Jelly` recieves an unknown command, it will respond to it with a message. You can customise it with the `unknownCommand` option. For example:

```js
const client = new JellyCommands({
	messages: {
		unknownCommand: {
			embeds: [
				{
					color: 'RANDOM',
					title: 'Unknown Command',
				},
			],
		},
	},
});
```
