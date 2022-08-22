# Registering Commands

Every command type can be registered either globally, or per guild.

## Global

Commands can be registered globally, meaning all guilds have access to that command. That is accessible with the [`global`](/api/commands.html#global) option.

```js
import { command } from 'jellycommands';

export default command({
    global: true,
})
```

:::tip NOTE
Global commands take up to an hour to take effect. When developing this is cumbersome, [dev mode fixes that](/guide/commands/dev). 
:::

## Guilds

You can also a register a command per guild, using the [`guilds`](/api/commands.html#guilds) option. These take effect instantly.

```js
import { command } from 'jellycommands';

export default command({
    // This command will register in both of these guilds
    guilds: ['663140687591768074', '755788441161302136'],
})
```

## Combined

You can combine the `guilds` and `global` option freely! Though this may have some unwanted side effects such as a command appearing twice.

```js
import { command } from 'jellycommands';

export default command({
    // This command will register in both of these guilds
    guilds: ['663140687591768074', '755788441161302136'],

    // It will also register globally
    global: true
})
```

:::tip NOTE
When using our [dev mode](/guide/commands/dev) the `guilds` and `global` field are ignored, so set these how you want your bot to behave when not in dev mode.
:::