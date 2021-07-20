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
  JellyCommands: () => JellyCommands,
  createEvent: () => createEvent
});

// src/util/fs.ts
var import_ghoststools = __toModule(require("ghoststools"));
var import_path = __toModule(require("path"));
var resolveImport = /* @__PURE__ */ __name((imp) => {
  imp = Object.assign({}, imp);
  if (imp.default && Object.keys(imp).length == 1)
    return imp.default;
  delete imp.default;
  return imp;
}, "resolveImport");
var readJSFile = /* @__PURE__ */ __name(async (path) => {
  const data = await import((0, import_path.resolve)(path));
  return resolveImport(data);
}, "readJSFile");
var readdirJSFiles = /* @__PURE__ */ __name(async (path) => {
  const files = (0, import_ghoststools.readdirRecursive)(path);
  const mapped = [];
  for (const path2 of files) {
    const { ext } = (0, import_path.parse)(path2);
    if (![".js", ".mjs", ".cjs"].includes(ext))
      continue;
    const data = await readJSFile(path2);
    mapped.push({
      path: path2,
      data
    });
  }
  return mapped;
}, "readdirJSFiles");

// src/JellyCommands/events/options.ts
var import_joi = __toModule(require("joi"));
var defaults = {
  disabled: false,
  once: false
};
var schema = import_joi.default.object({
  disabled: import_joi.default.bool().required(),
  once: import_joi.default.bool().required()
});

// src/JellyCommands/events/Event.ts
var import_ghoststools2 = __toModule(require("ghoststools"));
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
  return new Event(name, options.run, (0, import_ghoststools2.removeKeys)(options, "run"));
}, "createEvent");

// src/JellyCommands/events/EventManager.ts
var import_fs2 = __toModule(require("fs"));
var import_path2 = __toModule(require("path"));
var EventManager = class {
  constructor(jelly) {
    this.loadedPaths = new Set();
    this.jelly = jelly;
    this.client = jelly.client;
  }
  add(event) {
    const cb = /* @__PURE__ */ __name((...ctx) => event.run(...ctx, { client: this.client, jelly: this.jelly }), "cb");
    if (event.options.once)
      this.client.once(event.name, cb);
    else
      this.client.on(event.name, cb);
  }
  addPath(path) {
    if (this.loadedPaths.has(path))
      throw new Error(`The path ${path} has already been loaded, please do not attempt to load it twice`);
    else
      this.loadedPaths.add(path);
  }
  load(path) {
    const isDirectory = (0, import_fs2.lstatSync)(path).isDirectory();
    return isDirectory ? this.loadDirectory(path) : this.loadFile(path);
  }
  async loadFile(path) {
    const { ext } = (0, import_path2.parse)(path);
    if (![".js", ".mjs", ".cjs"].includes(ext))
      throw new Error(`${path} is not a JS file`);
    const event = await readJSFile(path);
    if (!(event instanceof Event))
      throw new TypeError(`Expected instance of Event for ${path}, recieved ${typeof event}`);
    if (event.options.disabled)
      return;
    this.addPath(path);
    this.add(event);
    return event;
  }
  async loadDirectory(path) {
    const paths = await readdirJSFiles(path);
    const events = [];
    for (const { path: path2, data: event } of paths) {
      if (!(event instanceof Event))
        throw new TypeError(`Expected instance of Event for ${path2}, recieved ${typeof event}`);
      if (event.options.disabled)
        continue;
      this.addPath(path2);
      this.add(event);
      events.push(event);
    }
    return events;
  }
};
__name(EventManager, "EventManager");

// src/JellyCommands/options.ts
var import_joi2 = __toModule(require("joi"));
var defaults2 = {
  ignoreBots: true,
  defaultPrefix: "?",
  perGuildPrefix: false
};
var schema2 = import_joi2.default.object({
  ignoreBots: import_joi2.default.bool().required(),
  defaultPrefix: import_joi2.default.string().min(1).max(64).required(),
  perGuildPrefix: import_joi2.default.bool().required()
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  JellyCommands,
  createEvent
});
