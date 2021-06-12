<div align="center">

![](https://raw.githubusercontent.com/ghostdevv/jellycommands/main/assets/jellycommands-banner.png)

`npm install jellycommands`

[![](https://img.shields.io/npm/v/jellycommands?label=Latest%20Version&style=for-the-badge&logo=npm&color=informational)](https://www.npmjs.com/package/jellycommands)

</div>

---

<br />

> # All our docs are located [here](https://ghostdevbusiness.gitbook.io/jellycommands/)

# Beta Installation
```bash
npm install https://github.com/ghostdevv/jellycommands
cd node_modules/jellycommands
npm install
npm run build
```

# Boilerplate
```js
import { Client } from 'discord.js';
import { JellyCommands } from 'jellycommands';

const client = new Client();
const jelly = new JellyCommands(client, {});

client.login();
```