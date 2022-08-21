# Loading Events

Just like commands, there are two ways to load events.

## Automatic Loading

If you want to load automatically from your file system you can pass in a string to the [events](/api/client#events) option.

```js
const client = new JellyCommands({
    events: 'src/events' // This would mean it loads all events in src/events  
})
```

You can also pass multiple directories if needed

:::tip NOTE
JellyCommands loads directories recursively, so you only need to load the top directory, for example if you had `src/events` as a command directory, events in `src/events/something/` will also be loaded
:::

```js
const client = new JellyCommands({
    events: ['src/events', 'src/otherevents']  
})
```

## Manually Loading

If you want to import your events manually the [events](/api/client#events) option supports that.

```js
import SomeEvent from '.'

const client = new JellyCommands({
    events: [
        SomeEvent
    ]
})
```

You can also combine that with auto-loading

```js
import SomeEvent from '.'

const client = new JellyCommands({
    events: [
        SomeEvent,
        'src/events'
    ]
})
```
