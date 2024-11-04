# Props

## Set Props

### Set on client create

You can set props using the [`props`](/api/client#props) property on the `JellyCommands` client.

```ts
import { JellyCommands } from 'jellycommands';

const client = new JellyCommands({
    props: {
        propOne: 'something'
    }
})
```

### Set/Modify dynamically

You can modify props anywhere you have access to them, the primary place would be the off the `client`.

```ts
const client = ...

client.props.propOne = 'something';
```

## Type Saftey

You can use the `Props` interface from JellyCommand's ambient types. If you use `create-jellycommands` this will already be setup in `src/app.d.ts`

```ts
/// <reference types="jellycommands/ambient" />

// See https://jellycommands.dev/guide/props
interface Props {
    propOne: string;
}
```
