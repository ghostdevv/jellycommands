# Loading Commands

There are two way to load commands with Jelly.

## Automatic Loading

If you want to load automatically from your file system you can pass in a string to the [commands](/api/client#commands) option.

```js
const client = new JellyCommands({
    commands: 'src/commands' // This would mean it loads all commands in src/commands  
})
```

You can also pass multiple directories if needed

:::tip NOTE
JellyCommands loads directories recursively, so you only need to load the top directory, for example if you had `src/commands` as a command directory, commands in `src/commands/something/` will also be loaded
:::

```js
const client = new JellyCommands({
    commands: ['src/commands', 'src/othercommands']  
})
```

## Manually Loading

If you want to import your commands manually the [commands](/api/client#commands) option supports that.

```js
import SomeCommand from '.'

const client = new JellyCommands({
    commands: [
        SomeCommand
    ]
})
```

You can also combine that with auto-loading

```js
import SomeCommand from '.'

const client = new JellyCommands({
    commands: [
        SomeCommand,
        'src/commands'
    ]
})
```
