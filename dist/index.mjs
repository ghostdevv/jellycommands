var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/JellyCommands/managers/BaseManager.ts
import { readdirRecursive, posixify } from "ghoststools";

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
import { lstatSync } from "fs";
var BaseManager = class {
  constructor() {
  }
  load(path) {
    path = resolve2(posixify(path));
    const isDirectory = lstatSync(path).isDirectory();
    return isDirectory ? this.loadDirectory(path) : this.loadFile(path);
  }
  async loadFile(path) {
    const { ext } = parse(path);
    if (![".js", ".mjs", ".cjs"].includes(ext))
      throw new Error(`${path} is not a JS file`);
    const item = await readJSFile(path);
    this.add(item, path);
    return item;
  }
  async loadDirectory(path) {
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

// src/JellyCommands/events/options.ts
import Joi from "joi";
var defaults = {
  disabled: false,
  once: false
};
var schema = Joi.object({
  disabled: Joi.bool().required(),
  once: Joi.bool().required()
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
    const { error, value } = schema.validate(Object.assign(defaults, options));
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
    const cb = /* @__PURE__ */ __name((...ctx) => event.run(...ctx, { client: this.client, jelly: this.jelly }), "cb");
    if (event.options.once)
      this.client.once(event.name, cb);
    else
      this.client.on(event.name, cb);
  }
};
__name(EventManager, "EventManager");

// src/JellyCommands/options.ts
import Joi2 from "joi";
var defaults2 = {
  ignoreBots: true,
  defaultPrefix: "?",
  perGuildPrefix: false
};
var schema2 = Joi2.object({
  ignoreBots: Joi2.bool().required(),
  defaultPrefix: Joi2.string().min(1).max(64).required(),
  perGuildPrefix: Joi2.bool().required()
});

// src/JellyCommands/JellyCommands.ts
var JellyCommands = class {
  #client;
  #options;
  constructor(client, options = {}) {
    if (!client)
      throw new SyntaxError("Expected a instance of Discord.Client, recieved none");
    this.#client = client;
    const { error, value } = schema2.validate(Object.assign(defaults2, options));
    if (error)
      throw error.annotate();
    else
      this.#options = value;
    this.eventManager = new EventManager(this);
  }
  get client() {
    return this.#client;
  }
  get options() {
    return Object.freeze({ ...this.#options });
  }
  get events() {
    return this.eventManager;
  }
};
__name(JellyCommands, "JellyCommands");
export {
  JellyCommands,
  createEvent
};
