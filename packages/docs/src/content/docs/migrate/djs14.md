---
title: Discord.js v14
description: Guide on migrating to the v1.0.0-next.32 JellyCommands pre-release.
---

JellyCommands now only supports Discord.js v14. [Read the full changelog](https://github.com/ghostdevv/jellycommands/blob/main/packages/jellycommands/CHANGELOG.md#100-next32).

## Migration

Fortunately there were minor changes to JellyCommands projects, once you have [updated to discord.js v14 using the official guide](https://discordjs.guide/additional-info/changes-in-v14.html#before-you-start), you can follow this list of updates

### Slash Command Options

Discord.js made the decision to switch from `SNAKE_CASE` on enum's to `CamelCase`, so we updated the command options to reflect that:

```diff
export default command({
    options: [
        {
-           type: 'CHANNEL',
+           type: 'Channel',
            name: 'channel',
            description: 'Channel to send a message into',
            required: true,
        },
    ],
})
```

### Guards Permissions

Just like the changes to Slash Command Options, you need to switch from `SNAKE_CASE` to `CamelCase`

```diff
export default command({
    guards: {
-       permissions: ['ADMINISTRATOR'],
+       permissions: ['Administrator'],
    },
})
```

## Support

If I missed anything off this guide, or you are struggling with the migration please [join the discord](https://discord.gg/2Vd4wAjJnm) to get support!
