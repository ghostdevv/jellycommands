---
title: Components
---

This guide covers breaking changes introduced in JellyCommands `1.0.0-next.44`. [View the full changelog](https://github.com/ghostdevv/jellycommands/blob/main/packages/jellycommands/CHANGELOG.md#100-next44)

## Dependency Changes

The following minimum versions are now required:

-   Node v20.13.1
-   Discord.js v14.15.3

## "Components"

Previously, you had to keep your `commands`/`events`/`buttons` in seperate folders, and configure them seperately. However, this enforced a file structure that was uninituitive. It also meant we kept having to add new options as we introduced new features to JellyCommands. To fix this we've encompassed everything under a new option called "components". You can now co-locate your `commands`/`events`/`buttons` (or "components"), and export them however you like.

```diff lang="ts"
const client = new JellyCommands({
-   commands: ['src/commands'],
-   events: ['src/events'],
-   buttons: ['src/buttons'],

+   components: ['src/components'],
});
```

If you want to reproduce the old file structure you can do:

```diff lang="ts"
const client = new JellyCommands({
-   commands: ['src/commands'],
-   events: ['src/events'],
-   buttons: ['src/buttons'],

+   components: ['src/commands', 'src/events', 'src/buttons'],
});
```

[Read more on components here](/guide/components).

## Client Logger

The `client.debug` log function has been removed in favour of both `client.log()` and `client.log.<level>()`.
