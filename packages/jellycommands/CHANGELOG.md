# jellycommands

## 1.0.0-next.44

### Minor Changes

- breaking: better logging ([#194](https://github.com/ghostdevv/jellycommands/pull/194))

- feat: support exporting a component under any name ([#206](https://github.com/ghostdevv/jellycommands/pull/206))

- feat: add option to control the file extensions that are allowed ([#206](https://github.com/ghostdevv/jellycommands/pull/206))

- breaking: add new "components" system ([#206](https://github.com/ghostdevv/jellycommands/pull/206))

- breaking: remove options.commands, options.events, and options.buttons in favour of single options.components ([#206](https://github.com/ghostdevv/jellycommands/pull/206))

- feat: make event name not strict ([`6e0fb8ef3cb284f48177a4022986106cc8b9285c`](https://github.com/ghostdevv/jellycommands/commit/6e0fb8ef3cb284f48177a4022986106cc8b9285c))

- feat: support a non-empty DEBUG environment variable to enable debug logs ([#202](https://github.com/ghostdevv/jellycommands/pull/202))

### Patch Changes

- breaking: require node v20.13.1 or above (drops node 16 & 18) ([#195](https://github.com/ghostdevv/jellycommands/pull/195))

- fix: skip any exports which aren't components, rather than erroring ([#206](https://github.com/ghostdevv/jellycommands/pull/206))

- fix: type error when manually adding command/event ([#199](https://github.com/ghostdevv/jellycommands/pull/199))

- fix: improve exports ([#196](https://github.com/ghostdevv/jellycommands/pull/196))

- deps: switch to ofetch from axios ([#193](https://github.com/ghostdevv/jellycommands/pull/193))

- fix: use correct regex for validating slash command names ([#190](https://github.com/ghostdevv/jellycommands/pull/190))

- fix: debug logs firing when debug is disabled ([#198](https://github.com/ghostdevv/jellycommands/pull/198))

- deps: remove totalist ([#189](https://github.com/ghostdevv/jellycommands/pull/189))

- fix: able to read files directly again ([#197](https://github.com/ghostdevv/jellycommands/pull/197))

- fix: reject lowercase slash command name ([`d6cede1956a407f43448a923179e2497c4f55f23`](https://github.com/ghostdevv/jellycommands/commit/d6cede1956a407f43448a923179e2497c4f55f23))

- fix: validate client id when parsing from token ([`0d898921d419258dab3ebdb15939ca49dbd62274`](https://github.com/ghostdevv/jellycommands/commit/0d898921d419258dab3ebdb15939ca49dbd62274))

- deps: switch to parsing with zod ([#190](https://github.com/ghostdevv/jellycommands/pull/190))

## 1.0.0-next.43

### Patch Changes

- nested files with \_ are now ignored correctly ([#180](https://github.com/ghostdevv/jellycommands/pull/180))

## 1.0.0-next.42

### Minor Changes

- support buttons ([#171](https://github.com/ghostdevv/jellycommands/pull/171))

## 1.0.0-next.41

### Patch Changes

- fix automatic file loading on windows ([#169](https://github.com/ghostdevv/jellycommands/pull/169))

## 1.0.0-next.40

### Patch Changes

- add errors to props.get, props.set, props.has to aid in migration ([#159](https://github.com/ghostdevv/jellycommands/pull/159))

- (breaking) update props api to be typesafe and easier to use ([#155](https://github.com/ghostdevv/jellycommands/pull/155))

- add a guard to catch no guild id when dev mode enabled ([#165](https://github.com/ghostdevv/jellycommands/pull/165))

- change command/event file resolution logic ([#161](https://github.com/ghostdevv/jellycommands/pull/161))

- update non-major dependancies ([#162](https://github.com/ghostdevv/jellycommands/pull/162))

## 1.0.0-next.39

### Patch Changes

- update dependancies ([`45dab7f`](https://github.com/ghostdevv/jellycommands/commit/45dab7fd09388390270460d2c42556a58cfe7f6e))

- change `nameLocalizations` & `descriptionLocalizations` to a partial type ([#153](https://github.com/ghostdevv/jellycommands/pull/153))

## 1.0.0-next.38

### Patch Changes

- move utility type (internal) ([`74cdbb1`](https://github.com/ghostdevv/jellycommands/commit/74cdbb10bad9b91cc838a7e83c5f56a5af2cc08e))

* fix event class type ([`f4bc9cc`](https://github.com/ghostdevv/jellycommands/commit/f4bc9ccfc4603a18f0886c115d9e27645dac5c04))

- fix broken disabled option ([#147](https://github.com/ghostdevv/jellycommands/pull/147))

## 1.0.0-next.37

### Patch Changes

- snowflake max length has changed ([`129e61d`](https://github.com/ghostdevv/jellycommands/commit/129e61d89d892be0602378a98d5be1f6d4dbb333))

## 1.0.0-next.36

### Patch Changes

- stop transformOptionType from mutating the object ([`aaf4b58`](https://github.com/ghostdevv/jellycommands/commit/aaf4b58d54f646d9aa05851ef24ac0ffb50f0c06))

* use applicationCommandData for hashId instead of options ([`12fb5ec`](https://github.com/ghostdevv/jellycommands/commit/12fb5ec92aeba5218b505acf1fed59b9c487379e))

## 1.0.0-next.35

### Patch Changes

- throw error if can't find option type ([`12ec023`](https://github.com/ghostdevv/jellycommands/commit/12ec023f90d25626718b1308ca86343d50eccf56))

* update JellyApplicationCommandOption types ([`aa151ad`](https://github.com/ghostdevv/jellycommands/commit/aa151adb35dfd0b13c0b038c167bb474fad7e3ea))

- update dependancies ([`0b359ab`](https://github.com/ghostdevv/jellycommands/commit/0b359abc4ec563febf638a26a36b567e0d0072eb))

## 1.0.0-next.34

### Patch Changes

- fix JellyApplicationCommandOption type ([#139](https://github.com/ghostdevv/jellycommands/pull/139))

## 1.0.0-next.33

### Patch Changes

- switch slash commands from CommandInteraction to ChatInputCommandInteraction ([#136](https://github.com/ghostdevv/jellycommands/pull/136))

## 1.0.0-next.32

### Patch Changes

- update to discord.js v14 ([#132](https://github.com/ghostdevv/jellycommands/pull/132))

* update docs links ([#133](https://github.com/ghostdevv/jellycommands/pull/133))

## 1.0.0-next.31

### Patch Changes

- fix event.run types ([`c5ff15d`](https://github.com/ghostdevv/jellycommands/commit/c5ff15db88dc740ff2d9368523045eaec4e729c4))

* update readme's ([`159086c`](https://github.com/ghostdevv/jellycommands/commit/159086c4725c99d6c47eab975c92227e7454ff0a))

## 1.0.0-next.30

### Minor Changes

- command name and description localisations ([`fd45708`](https://github.com/ghostdevv/jellycommands/commit/fd45708cff29705cb94ae2b2d8c342447bb6e658))

## 1.0.0-next.29

### Patch Changes

- fix command id resolution process ([`07e29b5`](https://github.com/ghostdevv/jellycommands/commit/07e29b5d63240ebf2dd5d6b7c41c8175e1f9b0fb))

## 1.0.0-next.28

### Patch Changes

- limit descriptions to 100 chars ([`dd7d18f`](https://github.com/ghostdevv/jellycommands/commit/dd7d18f8ba98e190c2a7aa967660a3aa01d29f3d))

## 1.0.0-next.27

### Minor Changes

- new permissions system ([`6fba181`](https://github.com/ghostdevv/jellycommands/commit/6fba18170a5f94a66f3171493b8d6da5e367db0c))

* new dm option ([`8bfaab1`](https://github.com/ghostdevv/jellycommands/commit/8bfaab1628c4ae69471a2518532284b6e7c37587))

### Patch Changes

- internally rename util to utils ([`0ae3767`](https://github.com/ghostdevv/jellycommands/commit/0ae3767edd50d85673afbce59f4f54881b26ab34))

* improve internal requester types ([`42c04ae`](https://github.com/ghostdevv/jellycommands/commit/42c04ae3e10f379bbb30a50ac3c3bb83365e5775))

- refactor internals to improve ([`18f0393`](https://github.com/ghostdevv/jellycommands/commit/18f03931023241177b1e7290dce3af7892632db1))

* switch to api v10 ([`f570a09`](https://github.com/ghostdevv/jellycommands/commit/f570a09fd348f79fca11c43004884b955ce279b4))

## 1.0.0-next.26

### Patch Changes

- update dependancies ([`6a33bc4`](https://github.com/ghostdevv/jellycommands/commit/6a33bc452f67162171589f9642ccde3a55c4b368))

## 1.0.0-next.25

### Patch Changes

- fix config.messages.unknownCommand types ([`f204f4e`](https://github.com/ghostdevv/jellycommands/commit/f204f4e2a2bbf9898bfd9b3489c672c58786fca9))

* add more error logging ([`b9612d9`](https://github.com/ghostdevv/jellycommands/commit/b9612d913bcf0c7985783f5ec893037a5fcebaa9))

## 1.0.0-next.24

### Patch Changes

- update deps ([`cd0dc14`](https://github.com/ghostdevv/jellycommands/commit/cd0dc14bce824c2cae901b3a1f0b265eb9846428))

## 1.0.0-next.23

### Patch Changes

- temporary disable permissions ([`4d83651`](https://github.com/ghostdevv/jellycommands/commit/4d83651cbe29439adc1a7eda9ae2b0309daa8164))

* improved API error format ([`06fde80`](https://github.com/ghostdevv/jellycommands/commit/06fde805aa076b8db06c2eb2a1641a24244ca00d))

## 1.0.0-next.22

### Patch Changes

- fix build ([`4be1aa2`](https://github.com/ghostdevv/jellycommands/commit/4be1aa2a610deb2e52873f83688db98e01e7a63c))

## 1.0.0-next.21

### Minor Changes

- f743648: error catching in events and commands

## 1.0.0-next.20

### Patch Changes

- 9877c1d: autocomplete for slash commands
- 2c6ed64: fix command run callback having incorrect signature

## 1.0.0-next.19

### Patch Changes

- e03a57e: moved token functions out of client and into util file
- eb5658c: fix being able to use type strings

## 1.0.0-next.18

### Patch Changes

- f5c3c56: improve cahce by checking ids in cache not structure
- 4899bf8: provide `Command` and `Event` directly
- e5bf84b: commands are only registered in dev guilds
- 8424b28: global dev mode
- f5c3c56: make login method responsible for creating CommandManager

## 1.0.0-next.17

### Patch Changes

- e42af01: this is a rerelease of last version, check changelog there

## 1.0.0-next.16

### Patch Changes

- 019ea17: migrated to discord-api-types instead of custom ones
- 81760af: command registration improvements
- bde2a8e: updates discord-api-types (and other deps) - fixes incorrect typings
- 81760af: improved command cache/presistance system
- 39a08cf: fix broken type - #86

## 1.0.0-next.15

### Minor Changes

- 1b829f5: cache is disableable

### Patch Changes

- 1b829f5: fixes token handling logic
