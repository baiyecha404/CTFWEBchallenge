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
exports.Editor = void 0;
const React = __importStar(require("react"));
const settings_provider_1 = require("../settings/settings-provider");
const broadcast_provider_1 = require("./broadcast-provider");
const canvas_1 = require("./canvas");
const colors_1 = require("./colors");
require("./index.scss");
const _Editor = (props) => {
    const { active, id, viewers } = React.useContext(broadcast_provider_1.BroadcastContext);
    const message = !active ? React.createElement("h1", { className: "no-broadcast" }, "Not Broadcasting") :
        React.createElement("h1", { className: "broadcast" },
            "Broadcasting as: ",
            React.createElement("span", { className: "broadcast-id" }, id),
            " (",
            React.createElement("span", { className: "viewers" }, viewers),
            ")");
    return (React.createElement(colors_1.ColorProvider, null,
        React.createElement("div", { className: "editor" },
            message,
            React.createElement(canvas_1.Canvas, null),
            React.createElement(colors_1.ColorPicker, null))));
};
exports.Editor = (props) => {
    const { settings } = React.useContext(settings_provider_1.SettingsContext);
    return (React.createElement(broadcast_provider_1.BroadcastProvider, { active: settings.allowViewers, id: settings.username },
        React.createElement(_Editor, Object.assign({}, props))));
};
