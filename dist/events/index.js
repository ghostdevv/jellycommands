// src/util/fs.ts
import {readdirSync, lstatSync} from "fs";
import {join, resolve, parse} from "path";
var posixify = (path) => path.replace(/\\/g, "/");
var readdirRecursiveSync = (path) => readdirSync(path).map((file) => join(path, file)).reduce((files, file) => [
  ...files,
  ...lstatSync(file).isDirectory() ? readdirRecursiveSync(file) : [file]
], []).map((p) => resolve(p)).map((p) => posixify(p));
var readJSFile = async (path) => {
  const data = await import(resolve(path));
  return data.default && Object.keys(data).length == 1 ? {...data.default} : data;
};
var readdirJSFiles = async (path) => {
  const files = readdirRecursiveSync(path);
  const mapped = [];
  for (const path2 of files) {
    const {ext} = parse(path2);
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
import {lstatSync as lstatSync2} from "fs";
import {parse as parse2} from "path";
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
    const isDirectory = lstatSync2(path).isDirectory();
    return isDirectory ? this.loadDirectory(path) : this.loadFile(path);
  }
  async loadFile(path) {
    const {ext} = parse2(path);
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
export {
  EventManager,
  createEvent
};
