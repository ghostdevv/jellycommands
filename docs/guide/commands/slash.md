# Slash Command Extras

Slash Commands have some unique features unlike `messageCommand` and `userCommand`.

## Options

Slash commands can take `options`. These could be variables like `strings`, `numbers`, or even `channels`.  `JellyCommands` uses `discord.js`'s system to provide a nice API on top.

See all [available options.](https://discord.js.org/#/docs/discord.js/main/typedef/ApplicationCommandOption)

### Providing Options

You can provide options with the [options](/api/commands#options-1) property.

```js
import { command } from 'jellycommands';

export default command({
    name: 'Command Name',
    description: 'A short description of what the command does',
  
    options: [
        {
            type: 'Channel',
            name: 'channel',
            description: 'Channel to send a message into',
            required: true,
        },
    ],

    run: ({ interaction }) => {
        // We set the second argument to true as this option is marked as required 
        const channel = interaction.options.getChannel('channel', true);

        // We can then use this channel!
        console.log(channel.name)
    }
});
```

Unlike the `discord.js` built in options, you can provide the option type as a `string`. If you prefer, however, you can provide it as an `enum`.

```js
import { ApplicationCommandOptionType } from 'discord.js';
import { command } from 'jellycommands';

export default command({
    options: [
        {
            type: ApplicationCommandOptionType.Channel,
            name: 'channel',
            description: 'Channel to send a message into',
            required: true,
        },
    ],
})
```

## Autocomplete


Some [Slash Command Options](#options) support the `autocomplete` property. When set to `true`, you can use the `autocomplete` handler.

For example, let's write a command that returns a color and provides autocomplete on the color names:

```js
import { command } from 'jellycommands';

const colors = [
    'Violet',
    'Indigo',
    'Blue',
    'Green',
    'Yellow',
    'Orange',
    'Red',
];

export default command({
    name: 'rainbow',
    description: 'send a rainbow',

    global: true,

    options: [
        {
            type: 'String',
            name: 'color',
            description: 'The color of the thing idk',
            required: true,
            // Enable autocomplete
            autocomplete: true,
        },
    ],

    run: ({ interaction }) => {
        interaction.reply(interaction.options.getString('color', true))
    },

    autocomplete: async ({ interaction }) => {
        // Get the name of the option that is being autocompleted
        const focused = interaction.options.getFocused(true);

        if (focused.name === 'color') {
            // Respond with 3 colours that match the current string
            interaction.respond(
                colors
                    .filter((color) => color.startsWith(focused.value))
                    .map((color) => ({ name: color, value: color }))
                    .slice(0, 3),
            );
        }
    },
});
```