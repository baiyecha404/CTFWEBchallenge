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
exports.BroadcastProvider = exports.BroadcastContext = void 0;
const React = __importStar(require("react"));
const peerjs_1 = __importDefault(require("peerjs"));
exports.BroadcastContext = React.createContext({
    uploadImage: () => { },
    active: false,
    id: "unknown",
    viewers: 0,
});
exports.BroadcastProvider = (props) => {
    const peerSet = React.useRef(new Set());
    const imageCache = React.useRef(undefined);
    const [_, update] = React.useState({});
    React.useEffect(() => {
        if (props.active) {
            const peer = new peerjs_1.default(props.id);
            peer.on("connection", (conn) => {
                peerSet.current.add(conn);
                if (imageCache.current) {
                    conn.on("open", () => {
                        conn.send(imageCache.current);
                    });
                }
                conn.on("close", () => {
                    peerSet.current.delete(conn);
                    update({});
                });
                update({});
            });
            return () => {
                peerSet.current = new Set();
                peer.destroy();
            };
        }
    }, [props.active, props.id]);
    const uploadImage = (image) => {
        imageCache.current = image;
        for (const conn of peerSet.current) {
            conn.send(image);
        }
    };
    return (React.createElement(exports.BroadcastContext.Provider, { value: { uploadImage, active: props.active, viewers: peerSet.current.size, id: props.id } }, props.children));
};
