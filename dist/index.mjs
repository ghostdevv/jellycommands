var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/util/fs.ts
import { readdirSync, lstatSync } from "fs";
import { join, resolve, parse } from "path";
var posixify = /* @__PURE__ */ __name((path) => path.replace(/\\/g, "/"), "posixify");
var readdirRecursiveSync = /* @__PURE__ */ __name((path) => readdirSync(path).map((file) => join(path, file)).reduce((files, file) => [
  ...files,
  ...lstatSync(file).isDirectory() ? readdirRecursiveSync(file) : [file]
], []).map((p) => resolve(p)).map((p) => posixify(p)), "readdirRecursiveSync");
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
var readdirJSFiles = /* @__PURE__ */ __name(async (path) => {
  const files = readdirRecursiveSync(path);
  const mapped = [];
  for (const path2 of files) {
    const { ext } = parse(path2);
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

// src/events/options.ts
import Joi from "joi";
var defaults = {
  disabled: false,
  once: false
};
var schema = Joi.object({
  disabled: Joi.bool().required(),
  once: Joi.bool().required()
});

// src/events/Event.ts
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

// src/events/EventManager.ts
import { lstatSync as lstatSync2 } from "fs";
import { parse as parse2 } from "path";
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
    const isDirectory = lstatSync2(path).isDirectory();
    return isDirectory ? this.loadDirectory(path) : this.loadFile(path);
  }
  async loadFile(path) {
    const { ext } = parse2(path);
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

// src/core/options.ts
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

// src/core/JellyCommands.ts
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
