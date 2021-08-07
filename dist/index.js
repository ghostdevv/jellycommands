var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// src/index.ts
__export(exports, {
  Command: () => Command,
  Event: () => Event,
  JellyCommands: () => JellyCommands,
  createCommand: () => createCommand,
  createEvent: () => createEvent
});

// src/JellyCommands/commands/options.ts
var import_joi = __toModule(require("joi"));
var schema = import_joi.default.object({
  disabled: import_joi.default.bool().default(false),
  allowDM: import_joi.default.bool().default(false),
  guards: import_joi.default.object({
    allowedUsers: import_joi.default.array().items(import_joi.default.string().length(18)).optional(),
    blockedUsers: import_joi.default.array().items(import_joi.default.string().length(18)).optional()
  }).default()
});

// src/JellyCommands/commands/Command.ts
var import_ghoststools = __toModule(require("ghoststools"));
var import_discord = __toModule(require("discord.js"));
var Command = class {
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
  check(message2) {
    if (!message2 || !(message2 instanceof import_discord.Message))
      throw new TypeError(`Expected type Message, recieved ${typeof message2}`);
    const opt = this.options;
    if (opt.disabled)
      return false;
    if (opt.allowDM === false && message2.channel.type == "DM")
      return false;
    return true;
  }
};
__name(Command, "Command");
var createCommand = /* @__PURE__ */ __name((name, options) => {
  return new Command(name, options.run, (0, import_ghoststools.removeKeys)(options, "run"));
}, "createCommand");

// src/JellyCommands/managers/BaseManager.ts
var import_ghoststools2 = __toModule(require("ghoststools"));
var import_fs = __toModule(require("fs"));

// src/util/fs.ts
var import_url = __toModule(require("url"));
var import_path = __toModule(require("path"));
var resolveImport = /* @__PURE__ */ __name((imp) => {
  if (imp.__esModule)
    return imp.default.default;
  if (imp.default && Object.keys(imp).length == 1)
    return imp.default;
  return imp;
}, "resolveImport");
var readJSFile = /* @__PURE__ */ __name(async (path) => {
  const data = await import((0, import_url.pathToFileURL)((0, import_path.resolve)(path)).href);
  return resolveImport(data);
}, "readJSFile");

// src/JellyCommands/managers/BaseManager.ts
var import_path2 = __toModule(require("path"));
var BaseManager = class {
  constructor() {
  }
  load(path) {
    path = (0, import_path2.resolve)((0, import_ghoststools2.posixify)(path));
    if (!(0, import_fs.existsSync)(path))
      throw new Error(`Path ${path} does not exist`);
    const isDirectory = (0, import_fs.lstatSync)(path).isDirectory();
    return isDirectory ? this.loadDirectory(path) : this.loadFile(path);
  }
  async loadFile(path) {
    if (!(0, import_fs.existsSync)(path))
      throw new Error(`File ${path} does not exist`);
    const { ext } = (0, import_path2.parse)(path);
    if (![".js", ".mjs", ".cjs"].includes(ext))
      throw new Error(`${path} is not a JS file`);
    const item = await readJSFile(path);
    this.add(item, path);
    return item;
  }
  async loadDirectory(path) {
    if (!(0, import_fs.existsSync)(path))
      throw new Error(`Directory ${path} does not exist`);
    const paths = (0, import_ghoststools2.readdirRecursive)(path).filter((p) => [".js", ".mjs", ".cjs"].includes((0, import_path2.parse)(p).ext));
    const items = [];
    for (const path2 of paths) {
      const item = await this.loadFile(path2);
      items.push(item);
    }
    return items;
  }
};
__name(BaseManager, "BaseManager");

// src/JellyCommands/managers/CommandManager.ts
var CommandManager = class extends BaseManager {
  constructor(jelly) {
    super();
    this.commands = new Map();
    this.loadedPaths = new Set();
    this.jelly = jelly;
    this.client = jelly.client;
    this.client.on("messageCreate", (m) => this.onMessage(m));
  }
  onMessage(message2) {
    const { prefix, messages } = this.jelly.options;
    if (!message2.content.startsWith(prefix))
      return;
    const commandWord = message2.content.slice(prefix.length).split(" ")[0].trim();
    if (commandWord.length == 0)
      return;
    const command = this.commands.get(commandWord);
    if (!command)
      return messages.unknownCommand && message2.channel.send(messages.unknownCommand);
    const { allowedUsers, blockedUsers } = command.options.guards;
    if (allowedUsers && !allowedUsers.includes(message2.author.id))
      return;
    if (blockedUsers && blockedUsers.includes(message2.author.id))
      return;
    const check = command.check(message2);
    if (check)
      command.run({
        message: message2,
        jelly: this.jelly,
        client: this.client
      });
  }
  add(command, path) {
    if (this.loadedPaths.has(path))
      throw new Error(`The path ${path} has already been loaded, therefore can not be loaded again`);
    this.loadedPaths.add(path);
    if (!(command instanceof Command))
      throw new Error(`Expected instance of Command, recieved ${typeof command}`);
    if (command.options.disabled)
      return;
    this.commands.set(command.name, command);
  }
};
__name(CommandManager, "CommandManager");

// src/JellyCommands/events/options.ts
var import_joi2 = __toModule(require("joi"));
var schema2 = import_joi2.default.object({
  disabled: import_joi2.default.bool().default(false),
  once: import_joi2.default.bool().required().default(false)
});

// src/JellyCommands/events/Event.ts
var import_ghoststools3 = __toModule(require("ghoststools"));
var Event = class {
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
__name(Event, "Event");
var createEvent = /* @__PURE__ */ __name((name, options) => {
  return new Event(name, options.run, (0, import_ghoststools3.removeKeys)(options, "run"));
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

// src/JellyCommands/JellyCommands.ts
var import_discord3 = __toModule(require("discord.js"));

// src/JellyCommands/options.ts
var import_discord2 = __toModule(require("discord.js"));
var import_joi3 = __toModule(require("joi"));
var message = import_joi3.default.alternatives().try(import_joi3.default.string(), import_joi3.default.object().instance(import_discord2.MessagePayload), import_joi3.default.object()).optional();
var schema3 = import_joi3.default.object({
  ignoreBots: import_joi3.default.bool().default(true),
  prefix: import_joi3.default.string().min(1).max(64).default("!"),
  messages: import_joi3.default.object({
    unknownCommand: message.default({
      embeds: [
        {
          description: "Unkown Command",
          color: "RANDOM"
        }
      ]
    })
  }).default()
});

// src/JellyCommands/JellyCommands.ts
var JellyCommands = class {
  constructor(client, options = {}) {
    if (!client || !(client instanceof import_discord3.Client))
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Command,
  Event,
  JellyCommands,
  createCommand,
  createEvent
});
