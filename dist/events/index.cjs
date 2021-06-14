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

// src/events/index.ts
__markAsModule(exports);
__export(exports, {
  EventManager: () => EventManager,
  createEvent: () => createEvent
});

// src/util/fs.ts
var import_fs = __toModule(require("fs"));
var import_path = __toModule(require("path"));
var posixify = (path) => path.replace(/\\/g, "/");
var readdirRecursiveSync = (path) => (0, import_fs.readdirSync)(path).map((file) => (0, import_path.join)(path, file)).reduce((files, file) => [
  ...files,
  ...(0, import_fs.lstatSync)(file).isDirectory() ? readdirRecursiveSync(file) : [file]
], []).map((p) => (0, import_path.resolve)(p)).map((p) => posixify(p));
var readJSFile = async (path) => {
  const data = await import((0, import_path.resolve)(path));
  return data.default && Object.keys(data).length == 1 ? {...data.default} : data;
};
var readdirJSFiles = async (path) => {
  const files = readdirRecursiveSync(path);
  const mapped = [];
  for (const path2 of files) {
    const {ext} = (0, import_path.parse)(path2);
    if (![".js", ".mjs"].includes(ext))
      continue;
    const data = await readJSFile(path2);
    mapped.push({
      path: path2,
      data
    });
  }
  return mapped;
};

// src/events/options.ts
var import_joi = __toModule(require("joi"));
var defaults = {
  name: "",
  disabled: false,
  once: false
};
var schema = import_joi.default.object({
  name: import_joi.default.string().required(),
  disabled: import_joi.default.bool().required(),
  once: import_joi.default.bool().required(),
  run: import_joi.default.func().required()
});

// src/events/EventManager.ts
var import_fs3 = __toModule(require("fs"));
var import_path2 = __toModule(require("path"));
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
  load(path) {
    const isDirectory = (0, import_fs3.lstatSync)(path).isDirectory();
    return isDirectory ? this.loadDirectory(path) : this.loadFile(path);
  }
  async loadFile(path) {
    const {ext} = (0, import_path2.parse)(path);
    if (![".js", ".mjs"].includes(ext))
      throw new Error(`${path} is not a JS file`);
    const data = await readJSFile(path);
    const {error, value} = schema.validate(Object.assign(defaults, data));
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
    for (const {data} of paths) {
      const {error, value} = schema.validate(Object.assign(defaults, data));
      if (value.disabled)
        continue;
      if (error)
        throw error.annotate();
      else
        this.add(value.name, value);
    }
    return paths.map(({path: path2, data}) => ({
      name: data.name,
      once: data.once,
      disabled: data.disabled,
      filePath: path2
    }));
  }
};
var createEvent = (name, data) => ({name, ...data});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EventManager,
  createEvent
});
