var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __require = (x) => {
  if (typeof require !== "undefined")
    return require(x);
  throw new Error('Dynamic require of "' + x + '" is not supported');
};
var __reExport = (target, module, desc) => {
  if (module && typeof module === "object" || typeof module === "function") {
    for (let key of __getOwnPropNames(module))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module) => {
  return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
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
  const data = await Promise.resolve().then(() => __toModule(__require(resolve(path))));
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
  name: "",
  disabled: false,
  once: false
};
var schema = Joi.object({
  name: Joi.string().required(),
  disabled: Joi.bool().required(),
  once: Joi.bool().required(),
  run: Joi.func().required()
});

// src/events/EventManager.ts
import { lstatSync as lstatSync2 } from "fs";
import { parse as parse2 } from "path";
var EventManager = class {
  constructor(jelly) {
    this.jelly = jelly;
    this.client = jelly.client;
  }
  add(name, data) {
    const cb = /* @__PURE__ */ __name((...ctx) => data.run(...ctx, { client: this.client, jelly: this.jelly }), "cb");
    if (data.once)
      this.client.once(name, cb);
    else
      this.client.on(name, cb);
  }
  load(path) {
    const isDirectory = lstatSync2(path).isDirectory();
    return isDirectory ? this.loadDirectory(path) : this.loadFile(path);
  }
  async loadFile(path) {
    const { ext } = parse2(path);
    if (![".js", ".mjs"].includes(ext))
      throw new Error(`${path} is not a JS file`);
    const data = await readJSFile(path);
    const { error, value } = schema.validate(Object.assign(defaults, data));
    if (value.disabled)
      return;
    if (error)
      throw error.annotate();
    else
      this.add(value.name, value);
    return {
      name: data.name,
      once: data.once,
      disabled: data.disabled,
      filePath: path
    };
  }
  async loadDirectory(path) {
    const paths = await readdirJSFiles(path);
    for (const { data } of paths) {
      const { error, value } = schema.validate(Object.assign(defaults, data));
      if (value.disabled)
        continue;
      if (error)
        throw error.annotate();
      else
        this.add(value.name, value);
    }
    return paths.map(({ path: path2, data }) => ({
      name: data.name,
      once: data.once,
      disabled: data.disabled,
      filePath: path2
    }));
  }
};
__name(EventManager, "EventManager");
var createEvent = /* @__PURE__ */ __name((name, data) => __spreadValues({ name }, data), "createEvent");

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
var _client, _options;
var JellyCommands = class {
  constructor(client, options = {}) {
    __privateAdd(this, _client, void 0);
    __privateAdd(this, _options, void 0);
    if (!client)
      throw new SyntaxError("Expected a instance of Discord.Client, recieved none");
    __privateSet(this, _client, client);
    const { error, value } = schema2.validate(Object.assign(defaults2, options));
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
    return Object.freeze(__spreadValues({}, __privateGet(this, _options)));
  }
  get events() {
    return this.eventManager;
  }
};
__name(JellyCommands, "JellyCommands");
_client = new WeakMap();
_options = new WeakMap();
export {
  EventManager,
  JellyCommands,
  createEvent
};
