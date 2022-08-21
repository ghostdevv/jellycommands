# Dev Mode

When developing slash commands the recommended work flow is to test them as a guild command, this is because global slash commands take up to an hour to register. So JellyCommands has a built in dev mode to make this super easy

## Setup

In our client options we can configure the dev option [dev option](/api/client#dev). We need to set the guilds array so that Jelly knows what guilds we want to use for developing

```js
const client = new JellyCommands({
    dev: {
        guilds: ['663140687591768074'], // Array of guild id's
    },
});
```

## Enabling Dev Mode

In any command you can set dev to true, you should also set `global` to true so that when out of dev the command is registered globally:

```js
import { command } from 'jellycommands';

export default command({
    name: 'commandname',
    description: 'A short description of what the command does',
    
    global: true,
    dev: true,
    
    run: ({ interaction }) => {
        // Do something with interaction
    }
})
```

## Global Dev Mode

When making a large bot adding `dev: true` to every command and remembering to remove it will become annoying, so we added a [global dev mode](/api/client#dev-global) to address that:

```js
const client = new JellyCommands({
    dev: {
        global: true, // This will enable dev mode on every command
        guilds: ['663140687591768074'], // Array of guild id's
    },
});
```

You can also use an environment variable to control dev mode to automatically put it in dev mode when developing and not in production.

```js
import 'dotenv/config' // This package reads environment variables from a .env file
import { Client } from 'jellycommands'

const DEV = process.env['NODE_ENV'] == 'development'

const client = new JellyCommands({
    dev: {
        global: DEV,
        guilds: ['663140687591768074'],
    },
});
```

You need to set `NODE_ENV="development"` in your `.env` file. In production you can set it to anything other than `development` such as `production` or not even set it at all!
