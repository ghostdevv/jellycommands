# Props API

The props api is a way of passing data around your project. This page will focus on use cases, for a detailed explaination of the props api [checkout the API page on it](/api/props).

## Setting Props

In our example lets pretend we are using a [`knex`](https://www.npmjs.com/package/knex) database. We can init our database and add it as a prop:

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

Now anywhere we have access to our `client` we can get the `db` prop

## Getting Props

In a command we might want access to our database, so we can use the props api to get it:

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
