# Messages

This feature is used to customise JellyCommands responses

## Unknown Command

If Jelly recieves an unknown command it will respond to it with a message, you can customise it with the `unknownCommand` option. For example:

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
})
```
