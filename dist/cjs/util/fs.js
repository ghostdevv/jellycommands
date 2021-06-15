"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readdirJSFiles = exports.readJSFile = exports.resolveImport = exports.readdirRecursiveSync = exports.posixify = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const posixify = (path) => path.replace(/\\/g, '/');
exports.posixify = posixify;
const readdirRecursiveSync = (path) => fs_1.readdirSync(path)
    .map((file) => path_1.join(path, file))
    .reduce((files, file) => [
    ...files,
    ...(fs_1.lstatSync(file).isDirectory()
        ? exports.readdirRecursiveSync(file)
        : [file]),
], [])
    .map((p) => path_1.resolve(p))
    .map((p) => exports.posixify(p));
exports.readdirRecursiveSync = readdirRecursiveSync;
const resolveImport = (imp) => {
    if (imp.default && Object.keys(imp).length == 1)
        return imp.default;
    delete imp.default;
    return imp;
};
exports.resolveImport = resolveImport;
const readJSFile = async (path) => {
    const data = await Promise.resolve().then(() => __importStar(require(path_1.resolve(path))));
    return exports.resolveImport(data);
};
exports.readJSFile = readJSFile;
const readdirJSFiles = async (path) => {
    const files = exports.readdirRecursiveSync(path);
    const mapped = [];
    for (const path of files) {
        const { ext } = path_1.parse(path);
        if (!['.js', '.mjs', '.cjs'].includes(ext))
            continue;
        const data = await exports.readJSFile(path);
        mapped.push({
            path,
            data,
        });
    }
    return mapped;
};
exports.readdirJSFiles = readdirJSFiles;
