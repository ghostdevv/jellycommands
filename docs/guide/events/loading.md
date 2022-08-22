# Loading Events

Just like commands, `events` can be loaded both automatically and manually.

## Automatic Loading

To automatically load `events` from your file system, you can specify the path to your `events` folder with the [events option](/api/client#events).

```js
const client = new JellyCommands({
    events: 'src/events' // Load all events in src/events
})
```

Multiple directories can be specified with an array.


```js
const client = new JellyCommands({
	events: ['src/events', 'src/otherevents']  
})
```

:::tip NOTE
`JellyCommands` loads directories recursively, so you only need to specify the top-level directory.

For example, if your `events` folder is set to `src/events`, files in `src/events/something/` will also be loaded.
:::

## Manual Loading

If you prefer to import your `events` manually, you can pass them in directly to the [events option](/api/client#events).

```js
import SomeEvent from '.'

const client = new JellyCommands({
    events: [
        SomeEvent
    ]
})
```

## Combined

Automatic and manual loading can be combined freely.

```js
import SomeEvent from '.'

const client = new JellyCommands({
    events: [
        SomeEvent,
        'src/events'
    ]
})
```