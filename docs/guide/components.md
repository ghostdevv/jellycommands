# Components

This covers components and how they're loaded in-depth. Check [here if you want an overview on components](/guide/overview.html#components), or click one of the guides below to learn about the different component types:

-   [Commands](/guide/commands/files)
-   [Events](/guide/events/files)
-   [Buttons](/guide/buttons/files)

## Loading Components

### File System Loading

The recommended way is to load components is via the filesystem. You can pass as many paths as you like, both directories and individual file paths. Directories will be searched recursively, so you only need to specify the top level path. Regardless of what the folders are named, you can house any components inside of them. We encourage you to organise them in a way that feels good to you.

```ts
const client = new JellyCommands({
	// Pass a single file/directory path
	components: 'src/components',

	// or pass multiple
	components: ['src/commands', 'src/events'],
});
```

All paths given are normalised to the [cwd](https://nodejs.org/docs/latest-v18.x/api/process.html#processcwd). If you have any issues I'd recommend giving an absolute path:

```ts
import { JellyCommands } from 'jellycommands';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Get the absolute path to the directory this file is in
const __dirname = dirname(fileURLToPath(import.meta.url));

const client = new JellyCommands({
	components: join(__dirname, './src/components'),
});
```

### Exports

The examples in the docs always use `export default` with components for brevity. However, the only requirement for JellyCommands to find a component is that it's exported. This means you can export them under whatever name you like! Any exports JellyCommands finds that aren't components, are ignored. The name of the export is also ignored.

```ts
import { command } from 'jellycommands';

// This works
export default command({ name: 'hello', ... })

// This works too!
export const something = command({ name: 'goodbye', ... })
```

### Ignored Files

Files that begin with `_`, or have an extension that isn't allowed are ignored.

### Configure Extensions

If you're using JavaScript or TypeScript then we already support that out of the box. However, if you're using something else you'll need to configure that extension using the `fs.extensions` option:

```ts
const client = new JellyCommands({
	fs: {
		extensions: ['.js', '.ts'],
	},
});
```
