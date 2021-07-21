var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/JellyCommands/managers/BaseManager.ts
import { readdirRecursive, posixify } from "ghoststools";
import { lstatSync, existsSync } from "fs";

// src/util/fs.ts
import { resolve } from "path";
var resolveImport = /* @__PURE__ */ __name((imp) => {
  imp = Object.assign({}, imp);
  if (imp.default && Object.keys(imp).length == 1)
    return imp.default;
  delete imp.default;
  return imp;
}, "resolveImport");
var readJSFile = /* @__PURE__ */ __name(async (path) => {
  const data = await import(resolve(path));
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
    const paths = readdirRecursive(path);
    const items = [];
    for (const path2 of paths) {
      const item = await this.loadFile(path2);
      items.push(item);
    }
    return items;
  }
};
__name(BaseManager, "BaseManager");

// src/JellyCommands/commands/options.ts
import Joi from "joi";
var defaults = {
  disabled: false,
  allowDM: false
};
var schema = Joi.object({
  disabled: Joi.bool().required(),
  allowDM: Joi.bool().required()
});

// src/JellyCommands/commands/Command.ts
import { removeKeys } from "ghoststools";
import { Message } from "discord.js";
var Command = class {
  constructor(name, run, options) {
    this.name = name;
    if (!name || typeof name != "string")
      throw new TypeError(`Expected type string for name, recieved ${typeof name}`);
    this.run = run;
    if (!run || typeof run != "function")
      throw new TypeError(`Expected type function for run, recieved ${typeof run}`);
    const { error, value } = schema.validate(Object.assign(defaults, options));
    if (error)
      throw error.annotate();
    else
      this.options = value;
  }
  check(message) {
    if (!message || !(message instanceof Message))
      throw new TypeError(`Expected type Message, recieved ${typeof message}`);
    const opt = this.options;
    if (opt.disabled)
      return false;
    if (opt.allowDM === false && message.channel.type == "dm")
      return false;
    return true;
  }
};
__name(Command, "Command");
var createCommand = /* @__PURE__ */ __name((name, options) => {
  return new Command(name, options.run, removeKeys(options, "run"));
}, "createCommand");

// src/JellyCommands/managers/CommandManager.ts
var CommandManager = class extends BaseManager {
  constructor(jelly) {
    super();
    this.commands = new Map();
    this.loadedPaths = new Set();
    this.jelly = jelly;
    this.client = jelly.client;
    this.client.on("message", this.onMessage.bind(this));
  }
  onMessage(message) {
    const { prefix } = this.jelly.options;
    if (!message.content.startsWith(prefix))
      return;
    const commandWord = message.content.slice(prefix.length).split(" ")[0].trim();
    if (commandWord.length == 0)
      return;
    const command = this.commands.get(commandWord);
    if (!command)
      return;
    const check = command.check(message);
    if (check)
      command.run();
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
import Joi2 from "joi";
var defaults2 = {
  disabled: false,
  once: false
};
var schema2 = Joi2.object({
  disabled: Joi2.bool().required(),
  once: Joi2.bool().required()
});

// src/JellyCommands/events/Event.ts
import { removeKeys as removeKeys2 } from "ghoststools";
var Event = class {
  constructor(name, run, options) {
    this.name = name;
    if (!name || typeof name != "string")
      throw new TypeError(`Expected type string for name, recieved ${typeof name}`);
    this.run = run;
    if (!run || typeof run != "function")
      throw new TypeError(`Expected type function for run, recieved ${typeof run}`);
    const { error, value } = schema2.validate(Object.assign(defaults2, options));
    if (error)
      throw error.annotate();
    else
      this.options = value;
  }
};
__name(Event, "Event");
var createEvent = /* @__PURE__ */ __name((name, options) => {
  return new Event(name, options.run, removeKeys2(options, "run"));
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

// src/JellyCommands/options.ts
import Joi3 from "joi";
var defaults3 = {
  ignoreBots: true,
  prefix: "!"
};
var schema3 = Joi3.object({
  ignoreBots: Joi3.bool().required(),
  prefix: Joi3.string().min(1).max(64).required()
});

// src/JellyCommands/JellyCommands.ts
var JellyCommands = class {
  constructor(client, options = {}) {
    if (!client)
      throw new SyntaxError("Expected a instance of Discord.Client, recieved none");
    this.client = client;
    const { error, value } = schema3.validate(Object.assign(defaults3, options));
    if (error)
      throw error.annotate();
    else
      this.options = value;
    this.eventManager = new EventManager(this);
    this.commandManager = new CommandManager(this);
  }
  get events() {
    return this.eventManager;
  }
  get commands() {
    return this.commandManager;
  }
};
__name(JellyCommands, "JellyCommands");
export {
  JellyCommands,
  createCommand,
  createEvent
};
