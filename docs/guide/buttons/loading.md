# Loading Buttons

JellyCommands can load `buttons` both automatically and manually. Usually we recommend loading them automatically for the best Developer Expierence.

## Automatic Loading

To automatically load `buttons` from your file system, you can specify the path to your `buttons` folder with the [buttons option](/api/client#buttons).

```js
const client = new JellyCommands({
    buttons: 'src/buttons' // Loads all buttons in src/buttons
})
```

Multiple directories can be specified with an array.

```js
const client = new JellyCommands({
    buttons: ['src/buttons', 'src/otherbuttons']  
})
```

:::tip NOTE
`JellyCommands` loads directories recursively, so you only need to specify the top-level directory.

For example, if your `buttons` folder is set to `src/buttons`, files in `src/buttons/something/` will also be loaded.
:::

## Manual Loading

If you prefer to import your `buttons` manually, you can pass them in directly to the [buttons option](/api/client#buttons).

```js
import SomeButton from '.'

const client = new JellyCommands({
    buttons: [
        SomeButton
    ]
})
```

## Combined

Automatic and manual loading can be combined freely.

```js
import SomeButton from '.'

const client = new JellyCommands({
    commands: [
        SomeButton,
        'src/buttons'
    ]
})
```
