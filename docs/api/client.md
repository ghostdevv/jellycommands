# Client

The `JellyCommands` client is the core of every project.  It extends the [discord.js client](https://discord.js.org/#/docs/discord.js/main/class/Client) to add additional functionality.

## Get Started

The basic setup is shown below.  The [intents field](https://discord.js.org/#/docs/discord.js/main/typedef/IntentsResolvable) is required by the `discord.js` client.

```js
import { JellyCommands } from 'jellycommands';

const client = new JellyCommands({
    clientOptions: {
        // Intents is required
        intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    },
});

client.login();
```

## Options

### commands

- Type: `string | Array<string | Command>`
- Guide: [/guide/commands](/guide/commands/loading)

Passing a string will automatically load commands from that directory, otherwise you can manually import your commands and pass them in as an `array`. Files prefixed with `_` are ignored.

### events 

- Type: `string | Array<string | Event>`
- Guide: [/guide/events](/guide/events/loading)

Passing a `string` will automatically load events from that directory.  Otherwise, you can manually import your events and pass them in as an `array`. Files prefixed with `_` are ignored.

### buttons

- Type: `string | Array<string | Button>`
- Guide: [/guide/buttons](/guide/buttons/loading)

Passing a `string` will automatically load buttons from that directory.  Otherwise, you can manually import your events and pass them in as an `array`. Files prefixed with `_` are ignored.

### clientOptions

- Type: [`ClientOptions`](https://discord.js.org/#/docs/discord.js/main/typedef/ClientOptions)
- Required

This is passed directly to the `discord.js` client

### props

- Type: `Props`
- Guide: [/guide/props](/guide/props)
- API: [/api/props](/api/props)

The built-in way to pass data through a `JellyCommands` app

### messages

- Guide: [/guide/messages](/guide/messages)

Customise `JellyCommands` responses

#### messages.unknownCommand

- Type: `string | MessagePayload | InteractionReplyOptions`

The default message sent when an unknown command interaction is recieved

### dev

- Guide: [/guide/commands/dev](/guide/commands/dev)

DX focused developer mode

#### dev.global

- Type: `boolean`

Whether dev mode should be enabled globally

#### dev.guilds

- Type: `string[]`

The guilds to register dev mode commands in

### cache

- Type: `boolean`
- Default: `true`

Enables `JellyCommands` cache. It's recommended to keep this on

### debug

- Type: `boolean`

Enables debug messages to be printed to console. If a non-empty `DEBUG` environment variable is set then this will automatically be enabled.

### fs

#### fs.extensions

-   Type: `string[]`
-   Default: `['.js', '.ts']`

Only files that end in these extensions are loaded.
