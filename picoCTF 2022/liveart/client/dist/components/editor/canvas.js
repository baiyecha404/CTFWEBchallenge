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
exports.Canvas = void 0;
const React = __importStar(require("react"));
const canvas_1 = require("../../canvas");
const hooks_1 = require("../../hooks");
const broadcast_provider_1 = require("./broadcast-provider");
const colors_1 = require("./colors");
exports.Canvas = (props) => {
    const { uploadImage } = React.useContext(broadcast_provider_1.BroadcastContext);
    const [canvas, setCanvas] = React.useState(null);
    const managerRef = React.useRef(null);
    const [image, setImage] = hooks_1.useLocalStorage("image", null);
    const { color } = React.useContext(colors_1.ColorContext);
    React.useEffect(() => {
        if (!canvas)
            return;
        managerRef.current = new canvas_1.CanvasManager(canvas, color);
        managerRef.current.on("change", (image) => {
            setImage(image);
            // We can't get the image until the canvas renders
            requestAnimationFrame(() => {
                uploadImage(canvas.toDataURL("image/png"));
            });
        });
        if (image) {
            managerRef.current.update(image);
        }
        return () => { var _a; return (_a = managerRef.current) === null || _a === void 0 ? void 0 : _a.destroy(); };
    }, [canvas]);
    React.useEffect(() => {
        var _a;
        (_a = managerRef.current) === null || _a === void 0 ? void 0 : _a.setColor(color);
    }, [color]);
    React.useEffect(() => {
        var _a;
        if (image) {
            (_a = managerRef.current) === null || _a === void 0 ? void 0 : _a.update(image);
        }
    }, [image]);
    return (React.createElement("canvas", { ref: setCanvas, className: "canvas", width: 64, height: 64 }));
};
