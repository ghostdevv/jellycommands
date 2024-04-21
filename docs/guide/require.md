# Import vs Require

This page is intended for those who are unfamiliar with the `import` statement or may have assumed it's only relevant to [`TypeScript`](https://www.typescriptlang.org/). While `import` is not specific to `JellyCommands` or `discord.js`, understanding how to use it is a fundamental skill in JavaScript development. Whether you're new to the language or just need a refresher, this page is designed to help you improve your JavaScript knowledge and skills.

:::tip TLDR
Use ESM import syntax, not `require`. Project's generated with `npm create jellycommands` support it out of the box! Continue reading if you are unsure what this means.
:::

## What is import and export syntax

If you're new to the Discord bot space and JavaScript development in general, you might be more familiar with the `require` statement from the old Node.js module syntax (CJS), which uses `module.exports`. However, in modern JavaScript development, it's recommended to use the new JavaScript module syntax (ESM), which uses `import` and `export`. This syntax is not only cleaner but also more powerful, making it an ideal choice for transitioning to in your development work. By using ESM syntax, you can take advantage of modern JavaScript features and improve the readability and maintainability of your code.

## ESM Support

ESM is supported in Node.js versions 12 and above. However, both `discord.js` and `JellyCommands` require Node.js 18 or higher, so you won't encounter any issues when using ESM syntax in these libraries. We recommend using the latest LTS (Long-term Support) version of Node.js, which provides stability and security updates over an extended period of time.

To use ESM syntax in your project, you may need to add a configuration field to your package.json file. Simply add the following line:

```json
"type": "module",
```

## Importing Modules

In JavaScript, you can use external code from other files and libraries by importing it into your code. There are two ways to import code, using the `require` syntax in CommonJS (CJS) or the `import` syntax in ECMAScript Modules (ESM).

### Importing with require in CommonJS

In CommonJS, you use the `require` method to import a module. When you use `require` to import a module, you assign the imported code to a variable. For example, to import the `Client` class from the `discord.js` library:

```js
const { Client } = require('discord.js');
```

In this example, we are using object destructuring to extract the `Client` class from the `discord.js` library.

### Importing with import in ESM

In ESM, you use the `import` keyword to import a module. The `import` keyword is followed by a pair of curly braces `{}` when importing named exports, or it can be used alone when importing default exports. Here's how to import the same `Client` class from `discord.js` using `import`:

```js
import { Client } from 'discord.js';
```

### Default Imports in CommonJS and ESM

In CommonJS, you can use `require` to import a default export from a module. The default export is assigned to the variable specified in the `require` statement. For example:

```js
const Discord = require('discord.js');
```

In this example, `Discord` is the default export of the `discord.js` module.

In ESM, you can use the `import` keyword followed by the variable name to import the default export of a module. For example:

```js
import Discord from 'discord.js';
```

In this example, `Discord` is the default export of the `discord.js` module.

## Exporting Modules

To make code available for importing, modules need to use `module.exports` or `export` statements to define what code can be used outside of the module.

### Named Exports

In CommonJS, you can export named exports by assigning them to properties of the `module.exports` object. For example:

```js
module.exports.something = 'Hello World';
```

In this example, we are exporting an object with a property called `something` that has a value of `'Hello World'`.

In ESM, you use the `export` keyword to export named exports. For example:

```js
export const something = 'Hello World';
```

In this example, we are exporting a constant called `something` that has a value of `'Hello World'`.

### Default Exports

In CommonJS, you can export a default export by assigning it to `module.exports`. For example:

```js
module.exports = 'Hello World';
```

In this example, we are exporting a string that says `'Hello World'`.

In ESM, you use `export default` to export a default export. For example:

```js
export default 'Hello World';
```

In this example, we are exporting a string that says `'Hello World'`.

### Using Named and Default Exports

In CommonJS, you can only export one value per module, either as a named export or a default export. In ESM, you can have both named and default exports in the same module.

For example, in a single ESM module you can have a default export:

```js
export default 'Hello World';
```

and also named exports:

```js
export const something = true;
```

To import both named and default exports from the same ESM module, you can use the following syntax:

```js
import helloWorld, { something } from './test.js';
```

In this example, we are importing both the default export `helloWorld` and the named export `something` from the `test.js` module.

You can also import them separately:

```js
import helloWorld from './test.js';
import { something } from './test.js';
```

This way you can use the named exports and default exports in different parts of your code.

## Support

If you're having trouble adapting to the new module system, feel free to [join our Discord](https://discord.gg/2Vd4wAjJnm) server for assistance. Both the CommonJS (CJS) and ECMAScript Modules (ESM) are supported by `JellyCommands` and `discord.js`, so you can switch between them if needed.
