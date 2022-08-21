# Slash Command Extras

Slash Commands have some extra features that context menu commands don't

## Options

Slash commands can take options, this could be things like `strings`, `numbers`, even `channels`. JellyCommands uses Discord.js built in System for this and provides a nice API 
on top. You can checkout [all available options here](https://discord.js.org/#/docs/discord.js/main/typedef/ApplicationCommandOption)

### Providing Options

You can use the [options property](/api/commands#options-1) to provide options:

```js
import { command } from 'jellycommands';

export default command({
    name: 'commandname',
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
})
```

Unlike discord.js built in options you can provide the option type as a string, but you can also provide it as an enum if you like, for example:

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


Some [Slash Command Options](#options) support the autocomplete property. When this is true, you can use the autocomplete handler. For example lets write a command that sends a colour, and provides auto complete on the colour names:

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
]

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
        // This gives you the name of the option that is being autocompleted
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