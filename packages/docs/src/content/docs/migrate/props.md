---
title: Props API
description: Guide on migrating to the v1.0.0-next.40 JellyCommands pre-release.
---

As of `1.0.0-next.40` the props api has changed, read this guide to figure out how to change your code. [Read the full changelog](https://github.com/ghostdevv/jellycommands/blob/main/packages/jellycommands/CHANGELOG.md#100-next40).

## Add App Types

You will need to add a file called `src/app.d.ts` with the following contents:

```ts
/// <reference types="jellycommands/ambient" />

// See https://jellycommands.dev/components/props
interface Props {}
```

## Change usage of props

Props changed from being an object with methods (`get`, `set`, and `has`), to a regular object.

```diff
- const db = props.get('db');
+ const db = props.db
```

```diff
- props.set('db', database);
+ props.db = database;
```

## Change how props are typed

Props are now typed globally for ease of use, you can edit the `Props` interface in your `src/app.d.ts` to achieve this. No more importing types everywhere you use your props.

## Accessing props in commands and events

We added the `props` object directly to command and event context to access it quicker:

```diff
export default command({
-   run({ client }) {
+   run({ props }) {
-       const db = client.props.get<DB>('db');
+       const db = props.db;
    }
})
```

## TS & JS Config

If you are using TypeScript you should have a `tsconfig.json` in your project, similiarly if you are using JavaScript you should have a `jsconfig.json` in your project. They should both look something like this:

```json
{
	"compilerOptions": {
		"lib": ["ESNext"],
		"module": "ESNext",
		"target": "ESNext",
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"moduleResolution": "node",
		"resolveJsonModule": true,
		"strict": true,
		"checkJs": true,
		"allowJs": true
	},
	"include": ["./src/**/*.js", "./src/**/*.ts"]
}
```

## Erroring

Props previously threw an error when you tried to access soemthing that didn't exist, this is no longer the case.
