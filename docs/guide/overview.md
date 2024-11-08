# Getting Started

Welcome to JellyCommands! A framework built around [discord.js](https://discord.js.org/) that allows you to easily create fully featured Discord bots. This guide will be easier to following with our official template. You can get started by running the following command:

```bash
npm create jellycommands@latest
```

:::tip NOTE
If you select TypeScript in the template your code will be run with [`tsm`](https://github.com/lukeed/tsm) to avoid the compilation step. JellyCommands doesn't have any requirements here, so you could easily replace it with your preffered ts loader, or a compilation step.
:::

## Project Structure

Now you've got your project created, take a moment to familiarise yourself with the structure:

```txt
├─ src/             - Project source code
│  ├─ index.js      - Your main file
│  │
│  └─ components/     - JellyCommands components automatically loaded from here
│     │   ready.js  - This ready event fires when the client starts
│     └── hello.js  - Example Hello World command
│
├─ README.md        - Helpful tips/reminders about your project
└─ .env.example     - This shows what your .env file should look like
```

## The Client

JellyCommands wraps the discord.js `Client` to provide a framework for building Discord Bots. If you're familiar with discord.js you'll see the similarities:

```ts
import { JellyCommands } from 'jellycommands';
import { IntentsBitField } from 'discord.js';

const client = new JellyCommands({
    clientOptions: {
        intents: [IntentsBitField.Flags.Guilds],
    },
});
```

## Components

In JellyCommands the `commands`/`events`/`buttons`/etc of your bot are called "components". We can pass these to our client manually, or use our automatical file system loader. This will recursively search the path(s) you pass in to find your components!

```ts
import { JellyCommands } from 'jellycommands';
import { IntentsBitField } from 'discord.js';

const client = new JellyCommands({
    clientOptions: {
        intents: [IntentsBitField.Flags.Guilds],
    },
    
    components: ['src/components'],
});

client.login();
```

Components currently include:

- [Commands](/guide/commands/files)
- [Events](/guide/events/files)
- [Buttons](/guide/buttons/files)
