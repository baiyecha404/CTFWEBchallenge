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
exports.ErrorPage = void 0;
const React = __importStar(require("react"));
const index_1 = require("../../hooks/index");
exports.ErrorPage = (props) => {
    var _a, _b;
    const params = index_1.useHashParams();
    const error = (_a = props.error) !== null && _a !== void 0 ? _a : params.error;
    const returnTo = (_b = props.returnTo) !== null && _b !== void 0 ? _b : params.returnTo;
    return (React.createElement("div", null,
        React.createElement("h1", null, "Uh Oh Spaghetti-Oh!"),
        React.createElement("h3", null, error),
        React.createElement("div", null,
            React.createElement("a", { href: returnTo }, "Return to previous page"),
            " or ",
            React.createElement("a", { href: "/" }, "go home"),
            ".")));
};
