# Creating Commands

`Commands` are files containing a `command` function.  They must be prefixed with `export default` in order to be loaded automatically.

When a `command` is invoked, the command's `run` function is called.  This is where your custom command logic lives.

## `Run`

This function is called everytime your command is, the main property you need is `interaction` which contains all the interaction information. There are a few additional properties listed below:

```js
export default command({
    run: ({ interaction, client, props }) => {
        // Do something
    }
})
```

### interaction

- Type for Slash Commands: [`ChatInputCommandInteraction`](https://discord.js.org/#/docs/discord.js/main/class/ChatInputCommandInteraction)
- Type for Context Menus: [`ContextMenuCommandInteraction`](https://discord.js.org/#/docs/discord.js/main/class/ContextMenuCommandInteraction)

The chat input command interaction data.

### client [`JellyCommands`](/api/client)

The client used by the command.

### props [`Props`](/api/props)

Your project's props.

## Command Types

The 3 types of commands are `command` (for slash commands), `messageCommand`, and `userCommand`.

See [`core options`](/api/commands#core-options) for all of the ways you can configure your commands.


### Slash Commands

Slash commands use the `command` helper.  Unlike the others, they accept `description` and `descriptionLocalizations` options.

```js
import { command } from 'jellycommands';

export default command({
    name: 'Command Name',
    description: 'A short description of what the command does',
    
    run: ({ interaction }) => {
        // Do something with interaction
    }
});
```

[See the options for `command` functions here.](/api/commands#options)

### Message Commands

Message commands appear in context menus when a user right-clicks a message.  They use the `messageCommand` helper.

```js
import { messageCommand } from 'jellycommands';

export default messageCommand({
    name: 'Command Name',
    
    run: ({ interaction }) => {
        // Do something with interaction
    }
});
```

[See the options for `messageCommand` functions here.](/api/commands#core-options)

### User Commands

User commands appear as context menus when right-clicking a user.  They use the `userCommand` helper.

```js
import { userCommand } from 'jellycommands';

export default userCommand({
    name: 'Command Name',
    
    run: ({ interaction }) => {
        // Do something with interaction
    }
});
```

[See the options for `userCommand` functions here.](/api/commands#core-options)
