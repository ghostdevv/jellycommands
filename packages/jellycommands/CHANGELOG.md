# jellycommands

## 1.0.0-next.30

### Minor Changes

-   command name and description localisations ([`fd45708`](https://github.com/ghostdevv/jellycommands/commit/fd45708cff29705cb94ae2b2d8c342447bb6e658))

## 1.0.0-next.29

### Patch Changes

-   fix command id resolution process ([`07e29b5`](https://github.com/ghostdevv/jellycommands/commit/07e29b5d63240ebf2dd5d6b7c41c8175e1f9b0fb))

## 1.0.0-next.28

### Patch Changes

-   limit descriptions to 100 chars ([`dd7d18f`](https://github.com/ghostdevv/jellycommands/commit/dd7d18f8ba98e190c2a7aa967660a3aa01d29f3d))

## 1.0.0-next.27

### Minor Changes

-   new permissions system ([`6fba181`](https://github.com/ghostdevv/jellycommands/commit/6fba18170a5f94a66f3171493b8d6da5e367db0c))

*   new dm option ([`8bfaab1`](https://github.com/ghostdevv/jellycommands/commit/8bfaab1628c4ae69471a2518532284b6e7c37587))

### Patch Changes

-   internally rename util to utils ([`0ae3767`](https://github.com/ghostdevv/jellycommands/commit/0ae3767edd50d85673afbce59f4f54881b26ab34))

*   improve internal requester types ([`42c04ae`](https://github.com/ghostdevv/jellycommands/commit/42c04ae3e10f379bbb30a50ac3c3bb83365e5775))

-   refactor internals to improve ([`18f0393`](https://github.com/ghostdevv/jellycommands/commit/18f03931023241177b1e7290dce3af7892632db1))

*   switch to api v10 ([`f570a09`](https://github.com/ghostdevv/jellycommands/commit/f570a09fd348f79fca11c43004884b955ce279b4))

## 1.0.0-next.26

### Patch Changes

-   update dependancies ([`6a33bc4`](https://github.com/ghostdevv/jellycommands/commit/6a33bc452f67162171589f9642ccde3a55c4b368))

## 1.0.0-next.25

### Patch Changes

-   fix config.messages.unknownCommand types ([`f204f4e`](https://github.com/ghostdevv/jellycommands/commit/f204f4e2a2bbf9898bfd9b3489c672c58786fca9))

*   add more error logging ([`b9612d9`](https://github.com/ghostdevv/jellycommands/commit/b9612d913bcf0c7985783f5ec893037a5fcebaa9))

## 1.0.0-next.24

### Patch Changes

-   update deps ([`cd0dc14`](https://github.com/ghostdevv/jellycommands/commit/cd0dc14bce824c2cae901b3a1f0b265eb9846428))

## 1.0.0-next.23

### Patch Changes

-   temporary disable permissions ([`4d83651`](https://github.com/ghostdevv/jellycommands/commit/4d83651cbe29439adc1a7eda9ae2b0309daa8164))

*   improved API error format ([`06fde80`](https://github.com/ghostdevv/jellycommands/commit/06fde805aa076b8db06c2eb2a1641a24244ca00d))

## 1.0.0-next.22

### Patch Changes

-   fix build ([`4be1aa2`](https://github.com/ghostdevv/jellycommands/commit/4be1aa2a610deb2e52873f83688db98e01e7a63c))

## 1.0.0-next.21

### Minor Changes

-   f743648: error catching in events and commands

## 1.0.0-next.20

### Patch Changes

-   9877c1d: autocomplete for slash commands
-   2c6ed64: fix command run callback having incorrect signature

## 1.0.0-next.19

### Patch Changes

-   e03a57e: moved token functions out of client and into util file
-   eb5658c: fix being able to use type strings

## 1.0.0-next.18

### Patch Changes

-   f5c3c56: improve cahce by checking ids in cache not structure
-   4899bf8: provide `Command` and `Event` directly
-   e5bf84b: commands are only registered in dev guilds
-   8424b28: global dev mode
-   f5c3c56: make login method responsible for creating CommandManager

## 1.0.0-next.17

### Patch Changes

-   e42af01: this is a rerelease of last version, check changelog there

## 1.0.0-next.16

### Patch Changes

-   019ea17: migrated to discord-api-types instead of custom ones
-   81760af: command registration improvements
-   bde2a8e: updates discord-api-types (and other deps) - fixes incorrect typings
-   81760af: improved command cache/presistance system
-   39a08cf: fix broken type - #86

## 1.0.0-next.15

### Minor Changes

-   1b829f5: cache is disableable

### Patch Changes

-   1b829f5: fixes token handling logic
