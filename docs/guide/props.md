# Props

`Props` are used to pass data around your project.

:::tip NOTE
This page will focus on use cases.  For a detailed explaination of the `props api`, [see the API page on it](/api/props).
:::

## Setting Props

For this example, we're using a [`knex`](https://www.npmjs.com/package/knex) database. In order to access the `knex` data in our bot, we must first add it as a `prop`:

```js
import { JellyCommands } from 'jellycommands';
import knex from 'knex';

const db = knex();

const client = new JellyCommands({
    props: {
        db
    }
})
```

We can now access our database with the `db` prop wherever `client` is available.

## Getting Props

To access our database in a `command`, for example, we can use the `props api`:

```js
import { command } from 'jellycommands';

export default command({
    name: 'proptest',
    description: 'A command for testing props',
    
    run: ({ interaction, client }) => {
        const db = client.props.get('db');

        // We can now use our knex db
    }
})
```
