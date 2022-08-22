# Import vs Require

This page is for those who don't know what `import` does or have assumed it's a TypeScript thing. It's not specific to JellyCommands or `discord.js` but will help your JavaScript learning!

:::tip TLDR
Use ESM import syntax, not `require`. Project's generated with `npm init jellycommands` support it out of the box! Continue reading if you are unsure what this means.
:::

## What is import and export syntax

A lot of new developers in the Discord bot space might be only used to seeing `require`, this is the old nodejs module syntax (CJS), this comes along with `module.exports`. The new JavaScript module syntax (ESM) uses `import` and `export`. Not only is this new syntax much cleaner but it's much more powerful so is a great thing to transition to using.

## Support

ESM is supported in Node 12 and above, `discord.js` & `JellyCommands` require Node 16+ so it's no issue! You might need to switch to esm syntax in your project by changing your package.json to have this field:

```json
{
    "type": "module"
}
```

## Importing Modules

Lets use `discord.js` as an example of how `import` and `require` differ:

CJS:
```js
const { Client } = require('discord.js');
```

ESM:
```js
import { Client } from 'discord.js'
```

A default import:

CJS
```js
const Discord = require('discord.js');
```

ESM:
```js
import Discord from 'discord.js';
```

## Exporting

With CJS exporting is done with `module.exports`, with ESM it's `export`

### Named exports

CJS
```js
module.exports.something = 'Hello World'
```

ESM
```js
export const something = 'Hello World'
```

### Default exports

CJS
```js
module.exports = 'Hello World'
```

ESM
```js
export default 'Hello World'
```

## Using named and default exports

With CJS it's not possible to use a named and default export, but with CJS you can! For example:

```js
export default 'Hello World'

export const something = true
```

You can import both of these from the same file:

```js
import helloWorld from './test.js'
import { something } from './test.js'
```

You can even import them in one line:

```js
import helloWorld, { something } from './test.js'
```

## Support

If you struggle with transitioning to the new module system please [join the discord](https://discord.gg/2Vd4wAjJnm) and we can help you. You can always switch back to CJS as both systems are supported by `JellyCommands` and `discord.js`.
