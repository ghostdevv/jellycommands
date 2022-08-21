# Loading Commands

`Jelly` can load `commands` both automatically and manually.

## Automatic Loading

To automatically load `commands` from your file system, you can specify the path to your `commands` folder with the [commands option](/api/client#commands).

```js
const client = new JellyCommands({
    commands: 'src/commands' // Loads all commands in src/commands
})
```

Multiple directories can be specified with an array.

```js
const client = new JellyCommands({
    commands: ['src/commands', 'src/othercommands']  
})
```

:::tip NOTE
`JellyCommands` loads directories recursively, so you only need to specify the top-level directory.

For example, if your `commands` folder is set to `src/commands`, files in `src/commands/something/` will also be loaded.
:::

## Manual Loading

If you prefer to import your `commands` manually, you can pass them in directly to the [commands option](/api/client#commands).

```js
import SomeCommand from '.'

const client = new JellyCommands({
    commands: [
        SomeCommand
    ]
})
```

## Combined

Automatic and manual loading can be combined freely.

```js
import SomeCommand from '.'

const client = new JellyCommands({
    commands: [
        SomeCommand,
        'src/commands'
    ]
})
```
