"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = exports.defaults = void 0;
exports.defaults = {
    name: '',
    disabled: false,
    once: false,
};
const joi_1 = __importDefault(require("joi"));
exports.schema = joi_1.default.object({
    name: joi_1.default.string().required(),
    disabled: joi_1.default.bool().required(),
    once: joi_1.default.bool().required(),
    run: joi_1.default.func().required(),
});
