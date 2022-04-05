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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const React = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const drawing_1 = require("../drawing");
const error_1 = require("../error");
const settings_1 = require("../settings");
const logo_png_1 = __importDefault(require("../../assets/logo.png"));
require("./index.scss");
const home_1 = require("../home");
const xss_submission_1 = require("../xss-submission");
const _App = () => {
    const nav = react_router_dom_1.useNavigate();
    return (React.createElement("div", { className: "page" },
        React.createElement("img", { src: logo_png_1.default, className: "logo", onClick: () => nav("/") }),
        React.createElement("div", { className: "page-content" },
            React.createElement(react_router_dom_1.Routes, null,
                React.createElement(react_router_dom_1.Route, { path: "/", element: React.createElement(home_1.Home, null) }),
                React.createElement(react_router_dom_1.Route, { path: "/error", element: React.createElement(error_1.ErrorPage, null) }),
                React.createElement(react_router_dom_1.Route, { path: "/drawing/:page", element: React.createElement(drawing_1.Drawing, null) }),
                React.createElement(react_router_dom_1.Route, { path: "/editor", element: React.createElement(Editor, null) }),
                React.createElement(react_router_dom_1.Route, { path: "/settings", element: React.createElement(settings_1.Settings, null) }),
                React.createElement(react_router_dom_1.Route, { path: "/link-submission", element: React.createElement(xss_submission_1.XSSSubmission, null) })))));
};
exports.App = () => {
    return (React.createElement(react_router_dom_1.BrowserRouter, null,
        React.createElement(settings_1.SettingsProvider, null,
            React.createElement(_App, null))));
};
