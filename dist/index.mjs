var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/JellyCommands/managers/BaseManager.ts
import { readdirRecursive, posixify } from "ghoststools";
import { lstatSync, existsSync } from "fs";

// src/util/fs.ts
import { pathToFileURL } from "url";
import { resolve } from "path";
var resolveImport = /* @__PURE__ */ __name((imp) => {
  if (imp.__esModule)
    return imp.default.default;
  if (imp.default && Object.keys(imp).length == 1)
    return imp.default;
  return imp;
}, "resolveImport");
var readJSFile = /* @__PURE__ */ __name(async (path) => {
  const data = await import(pathToFileURL(resolve(path)).href);
  return resolveImport(data);
}, "readJSFile");

// src/JellyCommands/managers/BaseManager.ts
import { parse, resolve as resolve2 } from "path";
var BaseManager = class {
  constructor() {
  }
  load(path) {
    path = resolve2(posixify(path));
    if (!existsSync(path))
      throw new Error(`Path ${path} does not exist`);
    const isDirectory = lstatSync(path).isDirectory();
    return isDirectory ? this.loadDirectory(path) : this.loadFile(path);
  }
  async loadFile(path) {
    if (!existsSync(path))
      throw new Error(`File ${path} does not exist`);
    const { ext } = parse(path);
    if (![".js", ".mjs", ".cjs"].includes(ext))
      throw new Error(`${path} is not a JS file`);
    const item = await readJSFile(path);
    this.add(item, path);
    return item;
  }
  async loadDirectory(path) {
    if (!existsSync(path))
      throw new Error(`Directory ${path} does not exist`);
    const paths = readdirRecursive(path).filter((p) => [".js", ".mjs", ".cjs"].includes(parse(p).ext));
    const items = [];
    for (const path2 of paths) {
      const item = await this.loadFile(path2);
      items.push(item);
    }
    return items;
  }
};
__name(BaseManager, "BaseManager");

// src/JellyCommands/events/options.ts
import Joi from "joi";
var schema = Joi.object({
  disabled: Joi.bool().default(false),
  once: Joi.bool().default(false)
});

// src/JellyCommands/events/Event.ts
import { removeKeys } from "ghoststools";
var Event = class {
  constructor(name, run, options) {
    this.name = name;
    if (!name || typeof name != "string")
      throw new TypeError(`Expected type string for name, recieved ${typeof name}`);
    this.run = run;
    if (!run || typeof run != "function")
      throw new TypeError(`Expected type function for run, recieved ${typeof run}`);
    const { error, value } = schema.validate(options);
    if (error)
      throw error.annotate();
    else
      this.options = value;
  }
};
__name(Event, "Event");
var createEvent = /* @__PURE__ */ __name((name, options) => {
  return new Event(name, options.run, removeKeys(options, "run"));
}, "createEvent");

// src/JellyCommands/managers/EventManager.ts
var EventManager = class extends BaseManager {
  constructor(jelly) {
    super();
    this.loadedPaths = new Set();
    this.jelly = jelly;
    this.client = jelly.client;
  }
  add(event, path) {
    if (this.loadedPaths.has(path))
      throw new Error(`The path ${path} has already been loaded, therefore can not be loaded again`);
    this.loadedPaths.add(path);
    if (!(event instanceof Event))
      throw new Error(`Expected instance of Event, recieved ${typeof event}`);
    if (event.options.disabled)
      return;
    const cb = /* @__PURE__ */ __name((...ctx) => event.run(...ctx, { client: this.client, jelly: this.jelly }), "cb");
    if (event.options.once)
      this.client.once(event.name, cb);
    else
      this.client.on(event.name, cb);
  }
};
__name(EventManager, "EventManager");

// src/JellyCommands/commands/options.ts
import Joi2 from "joi";
var snowflakeSchema = /* @__PURE__ */ __name(() => Joi2.array().items(Joi2.string().length(18)), "snowflakeSchema");
var schema2 = Joi2.object({
  description: Joi2.string().required(),
  options: Joi2.array(),
  defer: [
    Joi2.bool(),
    Joi2.object({
      ephemeral: Joi2.bool(),
      fetchReply: Joi2.bool()
    })
  ],
  defaultPermission: Joi2.bool(),
  guilds: snowflakeSchema(),
  global: Joi2.bool().default(false),
  disabled: Joi2.bool().default(false)
});

// src/JellyCommands/commands/Command.ts
import { removeKeys as removeKeys2 } from "ghoststools";
var Command = class {
  constructor(name, run, options) {
    this.name = name;
    if (!name || typeof name != "string")
      throw new TypeError(`Expected type string for name, recieved ${typeof name}`);
    this.run = run;
    if (!run || typeof run != "function")
      throw new TypeError(`Expected type function for run, recieved ${typeof run}`);
    const { error, value } = schema2.validate(options);
    if (error)
      throw error.annotate();
    else
      this.options = value;
  }
};
__name(Command, "Command");
var createCommand = /* @__PURE__ */ __name((name, options) => {
  return new Command(name, options.run, removeKeys2(options, "run"));
}, "createCommand");

// src/JellyCommands/managers/CommandManager.ts
var CommandManager = class extends BaseManager {
  constructor(jelly) {
    super();
    this.commands = new Map();
    this.loadedPaths = new Set();
    this.globalCommands = new Map();
    this.guildCommands = new Map();
    this.jelly = jelly;
    this.client = jelly.client;
    this.client.on("interactionCreate", (i) => {
      i.isCommand() && this.onCommand(i);
    });
  }
  async onCommand(interaction) {
    const command = this.commands.get(interaction.commandName);
    if (!command)
      return this.jelly.options.messages.unknownCommand && interaction.reply(this.jelly.options.messages.unknownCommand);
    const options = command.options;
    if (options.defer)
      await interaction.deferReply(typeof options.defer == "object" ? options.defer : {});
    command.run({
      jelly: this.jelly,
      client: this.client,
      interaction
    });
  }
  resolveApplicationCommandData(command) {
    return {
      name: command.name,
      description: command.options.description,
      options: command.options.options,
      defaultPermission: command.options.defaultPermission
    };
  }
  async register() {
    if (!this.client.isReady())
      throw new Error(`Client is not ready, only call register after client is ready`);
    await this.client.application?.commands.set([...this.globalCommands.values()].map((command) => this.resolveApplicationCommandData(command)));
    for (const [guild, commands] of this.guildCommands.entries()) {
      const resovledCommands = commands.map((command) => this.resolveApplicationCommandData(command));
      await this.client.application?.commands.set(resovledCommands, guild);
    }
    return new Map(this.commands);
  }
  add(command, path) {
    if (this.loadedPaths.has(path))
      throw new Error(`The path ${path} has already been loaded, therefore can not be loaded again`);
    this.loadedPaths.add(path);
    if (!(command instanceof Command))
      throw new Error(`Expected instance of Command, recieved ${typeof command}`);
    if (command.options.disabled)
      return;
    if (command.options.global)
      this.globalCommands.set(command.name, command);
    for (const guild of command.options.guilds || [])
      this.guildCommands.set(guild, [
        ...this.guildCommands.get(guild) || [],
        command
      ]);
    this.commands.set(command.name, command);
  }
};
__name(CommandManager, "CommandManager");

// src/JellyCommands/JellyCommands.ts
import { Client } from "discord.js";

// src/JellyCommands/options.ts
import { MessagePayload } from "discord.js";
import Joi3 from "joi";
var schema3 = Joi3.object({
  ignoreBots: Joi3.bool().default(true),
  prefix: Joi3.string().min(1).max(64).default("!"),
  messages: Joi3.object({
    unknownCommand: [
      Joi3.string(),
      Joi3.object().instance(MessagePayload),
      Joi3.object()
    ]
  }).default()
});

// src/JellyCommands/JellyCommands.ts
var JellyCommands = class {
  constructor(client, options = {}) {
    if (!client || !(client instanceof Client))
      throw new SyntaxError(`Expected a instance of Discord.Client, recieved ${typeof client}`);
    this.client = client;
    const { error, value } = schema3.validate(options);
    if (error)
      throw error.annotate();
    else
      this.options = value;
    this.events = new EventManager(this);
    this.commands = new CommandManager(this);
  }
};
__name(JellyCommands, "JellyCommands");
export {
  Command,
  Event,
  JellyCommands,
  createCommand,
  createEvent
};
