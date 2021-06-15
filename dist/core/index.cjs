var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};

// src/core/index.ts
__markAsModule(exports);
__export(exports, {
  JellyCommands: () => JellyCommands
});

// src/core/options.ts
var import_joi = __toModule(require("joi"));
var defaults = {
  ignoreBots: true,
  defaultPrefix: "?",
  perGuildPrefix: false
};
var schema = import_joi.default.object({
  ignoreBots: import_joi.default.bool().required(),
  defaultPrefix: import_joi.default.string().min(1).max(64).required(),
  perGuildPrefix: import_joi.default.bool().required()
});

// src/events/options.ts
var import_joi2 = __toModule(require("joi"));
var defaults2 = {
  name: "",
  disabled: false,
  once: false
};
var schema2 = import_joi2.default.object({
  name: import_joi2.default.string().required(),
  disabled: import_joi2.default.bool().required(),
  once: import_joi2.default.bool().required(),
  run: import_joi2.default.func().required()
});

// src/util/fs.ts
var import_fs = __toModule(require("fs"));
var import_path = __toModule(require("path"));
var posixify = (path) => path.replace(/\\/g, "/");
var readdirRecursiveSync = (path) => (0, import_fs.readdirSync)(path).map((file) => (0, import_path.join)(path, file)).reduce((files, file) => [
  ...files,
  ...(0, import_fs.lstatSync)(file).isDirectory() ? readdirRecursiveSync(file) : [file]
], []).map((p) => (0, import_path.resolve)(p)).map((p) => posixify(p));
var readdirJSFiles = async (path) => {
  const files = readdirRecursiveSync(path);
  const mapped = [];
  for (const path2 of files) {
    const {ext, name} = (0, import_path.parse)(path2);
    if ([".js", ".mjs"].includes(ext) && !name.startsWith("_"))
      continue;
    const data = await import(path2);
    mapped.push({
      path: path2,
      data
    });
  }
  return mapped;
};

// src/events/EventManager.ts
var EventManager = class {
  constructor(jelly) {
    this.jelly = jelly;
    this.client = jelly.client;
  }
  add(name, data) {
    const cb = (...ctx) => data.run(...ctx, {client: this.client, jelly: this.jelly});
    if (data.once)
      this.client.once(name, cb);
    else
      this.client.on(name, cb);
  }
  async load(path) {
    const paths = await readdirJSFiles(path);
    for (const {data} of paths) {
      const {error, value} = schema2.validate(Object.assign(defaults2, data));
      if (error)
        throw error.annotate();
      else
        this.add(value.name, value);
    }
  }
};

// src/core/JellyCommands.ts
var _client, _options;
var JellyCommands = class {
  constructor(client, options = {}) {
    __privateAdd(this, _client, void 0);
    __privateAdd(this, _options, void 0);
    if (!client)
      throw new SyntaxError("Expected a instance of Discord.Client, recieved none");
    __privateSet(this, _client, client);
    const {error, value} = schema.validate(Object.assign(defaults, options));
    if (error)
      throw error.annotate();
    else
      __privateSet(this, _options, value);
    this.eventManager = new EventManager(this);
  }
  get client() {
    return __privateGet(this, _client);
  }
  get options() {
    return Object.freeze({...__privateGet(this, _options)});
  }
  get events() {
    return this.eventManager;
  }
};
_client = new WeakMap();
_options = new WeakMap();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  JellyCommands
});
