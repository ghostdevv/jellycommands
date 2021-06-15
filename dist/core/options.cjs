"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = exports.defaults = void 0;
exports.defaults = {
    ignoreBots: true,
    defaultPrefix: '?',
    perGuildPrefix: false,
};
const joi_1 = __importDefault(require("joi"));
exports.schema = joi_1.default.object({
    ignoreBots: joi_1.default.bool().required(),
    defaultPrefix: joi_1.default.string().min(1).max(64).required(),
    perGuildPrefix: joi_1.default.bool().required(),
});
