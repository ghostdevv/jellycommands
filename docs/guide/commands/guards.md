# Guards

Guards are a built-in way of protecting commands, at the moment we use Discord's permissions system and in the future might even support local guards!

## Permissions

To set what people can use a command based on what permissions they have in a guild you can use [`guards.permissions`](/api/commands#guards).

```js
import { command } from 'jellycommands';

export default command({
    name: 'commandname',
    description: 'A short description of what the command does',
    
    guards: {
        // This means only people with the ADMINISTRATOR permission can use the command
        permissions: [
            'ADMINISTRATOR'
        ]
    },
    
    run: ({ interaction }) => {
        // Do something with interaction
    }
})
```
