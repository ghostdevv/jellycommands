# Quick Start

`JellyCommands` includes a versatile tool that provides you with a simple and intuitive command-line interface (CLI) for generating new projects. You can create a new project with all the basic files and directories you need to get started. Simply open your terminal and run the following command:

```bash
npm create jellycommands project-name
```

This will create a new project with the specified name. From there, you can dive right into your code, or explore some of the additional features and options available to you.

## Project Overview

Take a moment to familiarize yourself with the structure of your project. This will help you navigate and organize your code effectively. Here's a rough overview of what each file and folder does. Don't forget to check the generated `README.md` for additional tips and reminders.

```txt
├─ src/             - Project source code
│  ├─ index.js      - Your main file
│  │
│  ├─ commands/     - JellyCommands command automatically loaded from here
│  │  └── hello.js  - Example Hello World command
│  │
│  └─ events/       - JellyCommands events automatically loaded from here
│     └── ready.js  - This ready event fires when the client starts
│
├─ README.md        - Helpful tips/reminders about your project
└─ .env.example     - This shows what your .env file should look like
```

## TypeScript

With JellyCommands, you can take advantage of [TypeScript](https://www.typescriptlang.org/)'s powerful features to build bots that are more robust and easier to maintain. To get started, simply use the [`CLI`](#quick-start), and choose whether you'd like to use TypeScript. If you opt-in, the template will use [`tsm`](https://github.com/lukeed/tsm) to run your code without any compilation step. However, if you prefer to compile your code, you can easily swap it out for a compiler like `tsc` or [`tsup`](https://www.npmjs.com/package/tsup).
