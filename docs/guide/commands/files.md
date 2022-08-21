# The Basics

Once you have your command files loaded, you can start writing them.

## Setup

All command files use a helper function to setup the command and then export that:

### Slash Commands

Slash commands use the `command` helper, for example:

```js
import { command } from 'jellycommands';

export default command({
    name: 'commandname',
    description: 'A short description of what the command does',
    
    run: ({ interaction }) => {
        // Do something with interaction
    }
})
```

[You can view the options for the `command` function here.](/api/commands#options)

### Message Commands

Message commands are context menus on messages, for them you use the `messageCommand` helper:

```js
import { messageCommand } from 'jellycommands';

export default messageCommand({
    name: 'Command Name',
    
    run: ({ interaction }) => {
        // Do something with interaction
    }
})
```

[You can view the options for the `messageCommand` function here.](/api/commands#core-options)

### User Commands

User commands are context menus on users, for them you use the `userCommand` helper:

```js
import { userCommand } from 'jellycommands';

export default userCommand({
    name: 'Command Name',
    
    run: ({ interaction }) => {
        // Do something with interaction
    }
})
```

[You can view the options for the `userCommand` function here.](/api/commands#core-options)
