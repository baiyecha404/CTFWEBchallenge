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
exports.ColorPicker = exports.ColorProvider = exports.ColorContext = exports.colors = void 0;
const React = __importStar(require("react"));
exports.colors = [
    0xFFFFFF, 0x000000,
    0x616161, 0xBDBDBD,
    0xF44336, 0x9C27B0,
    0x673AB7, 0x3F51B5,
    0x009688, 0x4CAF50,
    0xCDDC39, 0xFFEB3B,
    0xFF9800, 0xFF5722,
    0x795548, 0x607D8B,
];
exports.ColorContext = React.createContext({ setColor: () => { }, color: 0xFFFFFF });
exports.ColorProvider = (props) => {
    const [color, setColor] = React.useState(exports.colors[0]);
    return (React.createElement(exports.ColorContext.Provider, { value: { setColor, color } }, props.children));
};
exports.ColorPicker = () => {
    const { setColor, color } = React.useContext(exports.ColorContext);
    return (React.createElement("div", { className: "color-picker" }, exports.colors.map((c, i) => (React.createElement("div", { key: i, className: `color-picker-color ${color === c ? "selected" : ""}`, style: { backgroundColor: `#${c.toString(16).padStart(6, "0")}` }, onClick: () => setColor(c) })))));
};
