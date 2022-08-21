# Slash Command Options

Slash commands can take options, this could be things like `strings`, `numbers`, even `channels`. JellyCommands uses Discord.js built in System for this and provides a nice API 
on top.

## API

### Options

You can checkout [all available options here](https://discord.js.org/#/docs/discord.js/main/typedef/ApplicationCommandOption)

### Getting Options

You can view how to get the different [options from a CommandInteraction here](https://discord.js.org/#/docs/discord.js/13.9.2/class/CommandInteraction)

## Providing Options

You can use the [options property](/api/commands#options-1) to provide options:

```js
import { command } from 'jellycommands';

export default command({
    name: 'commandname',
    description: 'A short description of what the command does',
  
    options: [
        {
            type: 'CHANNEL',
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
