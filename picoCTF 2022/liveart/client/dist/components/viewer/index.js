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
exports.Viewer = void 0;
const React = __importStar(require("react"));
const baseResolution = { width: 384, height: 384 };
exports.Viewer = (props) => {
    const [dimensions, updateDimensions] = React.useReducer((canvasDimensions, windowDimensions) => {
        const newScale = Math.floor(Math.min((windowDimensions.width / baseResolution.width), (windowDimensions.height / baseResolution.height)));
        const desiredDimensions = { width: baseResolution.width * newScale, height: baseResolution.height * newScale };
        if (desiredDimensions.width !== canvasDimensions.width || desiredDimensions.height !== canvasDimensions.height) {
            return desiredDimensions;
        }
        else {
            return canvasDimensions;
        }
    }, baseResolution);
    React.useEffect(() => {
        const listener = () => {
            updateDimensions({ width: window.innerWidth - 100, height: window.innerHeight - 200 });
        };
        window.addEventListener("resize", listener);
        return () => {
            window.removeEventListener("resize", listener);
        };
    }, []);
    return (React.createElement("div", null,
        React.createElement("h1", null, "Viewing"),
        React.createElement("img", Object.assign({ src: props.image }, dimensions))));
};
