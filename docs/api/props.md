# Props API

The props api is a way of passing data around your project. 

## Adding Props


### Provide when creating your client

The best way to set data is to include the props object in your client options, for example:

```js
const myProp = 'hello';

const client = new JellyCommands();
```

### Provide dynamically

You can also set props dynamically using `client.props.set`

```js
const client = new JellyCommands({});

client.props.set('key', 'value');
```

## Getting Data

:::tip NOTE
Props will throw a error if it can't find the requested prop, this is so you don't have to do if statements to see if your prop exists or not. You might only need to worry about whether a prop exists if you are doing dynamic props, for this you can use `client.props.has`
:::

You can use client.props.get to get data, in the example below you will see how we are able to get the myProp data in a command (you can do this anywhere you have access to the client such as commands or events):

```js
import { command } from 'jellycommands';

export default command({
    name: 'proptest',
    description: 'A command for testing props',
    
    run: ({ interaction, client }) => {
        const prop = client.props.get('myProp');
        
        return interaction.reply({
            content: `The prop is ${prop}`
        })
    }
})
```

## Checking if a prop exists

Since props will throw a error if you try and get one that doesn't exist, you can use the has helper to see if a prop exists:

```js
const client = new JellyCommands({
    props: {
        one: 1,
        two: 2
    }
});

client.props.has('one'); // returns true
client.props.has('two'); // returns true
client.props.has('three'); // returns false
```
