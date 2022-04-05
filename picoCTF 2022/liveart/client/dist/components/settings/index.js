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
exports.SettingsProvider = exports.Settings = void 0;
const React = __importStar(require("react"));
const wrappers_1 = require("../../wrappers");
const settings_options_1 = require("./settings-options");
require("./index.scss");
const getWrappedOptions = wrappers_1.WrapComponentError(settings_options_1.SettingsOptions, "/settings");
exports.Settings = () => {
    const options = getWrappedOptions({});
    return (React.createElement("div", { className: "frame settings" },
        React.createElement("h1", null, "Settings"),
        options));
};
var settings_provider_1 = require("./settings-provider");
Object.defineProperty(exports, "SettingsProvider", { enumerable: true, get: function () { return settings_provider_1.SettingsProvider; } });
