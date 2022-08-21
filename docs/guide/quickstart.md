# Quick Start

JellyCommands includes a CLI to generate your projects. To get started open your terminal and run:

```bash
npm init jellycommands project-name
```

Now you can dive straight into your code, or continue reading!

## Project Overview

Below is a rough overview of the structure of your project and what each of the files do. Don't forget to check the generated README.md in your project

```
.env.example        - This shows what your .env file should look like
README.md           - Helpful tips/reminders about your project
src/                - Project source code
  index.js          - Your main file
  events/           - JellyCommands events automatically loaded from here
    ready.js        - This ready event fires when the client starts
  commands/         - JellyCommands command automatically loaded from here
    hello.js        - Example Hello World command
```

## TypeScript

JellyCommands supports typescript. The CLI `npm init jellycommands` will ask you whether you would like to use it. The template uses [`tsm`](https://github.com/lukeed/tsm) to run code without a compilation step, but you can easily swap it out for `tsc` or another compiler like `tsup` if you would like a compilation step.