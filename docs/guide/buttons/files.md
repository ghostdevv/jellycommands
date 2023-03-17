# Creating Buttons

`Button` files contain a button handler. They aren't responsible for adding buttons to messages but are a way of running code when the buttons you made are pressed.

```js
import { button } from 'jellycommands';

export default button({
    id: 'test',

    run: () => {
        // Do something with button click
    }
})
```

[You can view a list of all the button options here](/api/buttons#options)

## Button `id`

The `id` field on the button is important, it can be a `string`, `regexp`, or a function. The `id` field corresponds to the `customId` feild you set when you create a button.

### Simple ids

The simplest form is a plain string, for example you could have an id of `hello`. This might be a button that does the same thing each time.

```js
import { button } from 'jellycommands';

export default button({
    id: 'hello',

    run: async ({ interaction }) => {
        await interaction.reply({
            content: 'Hello there!'
        })
    }
})
```

### Regex & Function ids

If the id is not the same each time. As an example, say you have a button that should respond with a fruit name. Your id might look like `fruit_[FRUIT NAME]`, we can impliment this with regex or a function. The function should always return `true` or `false`

```js
import { button } from 'jellycommands';

export default button({
    // a regex id
    id: /fruit_([\w])+/,

    // a function id
    id: (id) => {
        return id.startsWith('fruit_');
    },

    run: async ({ interaction }) => {
        const fruit = interaction.customId.replace('fruit_', '');

        await interaction.reply({
            content: `Your fruit is ${fruit}`
        })
    }
})
```

## Button `run` handler

When an `event` is invoked, the event's `run` function is called.  This is where your custom event logic lives.

When a button is clicked, the `run` function is called. This is where your custom logic for the button lives.

You are provided with [`context`](/guide/buttons/files.html#context), which allows you to get things such as the `interaction`.

### Context

The context object has the following properties:

### interaction [`ButtonInteraction`](https://discord.js.org/#/docs/discord.js/main/class/ButtonInteraction)

The button interaction from discord.js

#### client [`JellyCommands`](/api/client)

The client used by the command.

#### props [`Props`](/api/props)

Your project's props.