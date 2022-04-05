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
exports.Drawing = void 0;
const React = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const peerjs_1 = __importDefault(require("peerjs"));
const wrappers_1 = require("../../wrappers");
const viewer_1 = require("../viewer");
const error_1 = require("../error");
const getWrappedError = wrappers_1.WrapComponentError(error_1.ErrorPage);
const getWrappedViewer = wrappers_1.WrapComponentError(viewer_1.Viewer);
const isWideEnough = () => window.innerWidth > 600;
const _Drawing = (props) => {
    const [image, setImage] = React.useState();
    const [bigEnough, setBigEnough] = React.useState(isWideEnough());
    const page = props.page;
    React.useEffect(() => {
        if (!page)
            return;
        const peer = new peerjs_1.default();
        peer.on("open", () => {
            const conn = peer.connect(page);
            conn.on("data", (data) => {
                if (typeof data === "string") {
                    setImage(data);
                }
            });
        });
    }, [page]);
    React.useEffect(() => {
        const listener = () => {
            setBigEnough(isWideEnough());
        };
        window.addEventListener("resize", listener);
        return () => {
            window.removeEventListener("resize", listener);
        };
    });
    const view = bigEnough
        ? getWrappedViewer({ image })
        : getWrappedError({ error: "Please make your window bigger" });
    return (React.createElement("div", null, view));
};
exports.Drawing = () => {
    const params = react_router_dom_1.useParams();
    return (React.createElement(_Drawing, { page: params.page }));
};
