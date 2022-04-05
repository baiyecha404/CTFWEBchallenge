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
exports.useLocalStorage = exports.useHashParams = void 0;
const React = __importStar(require("react"));
const getHashParams = () => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const result = Object.create(null);
    params.forEach((value, key) => {
        result[key] = value;
    });
    return result;
};
exports.useHashParams = () => {
    const [params, setParams] = React.useState(getHashParams());
    React.useEffect(() => {
        const listener = () => {
            setParams(getHashParams());
        };
        window.addEventListener("hashchange", listener);
        return () => {
            window.removeEventListener("hashchange", listener);
        };
    });
    return params;
};
const getFromStorage = (key, defaultValue) => {
    const item = window.localStorage.getItem(key);
    if (item) {
        return JSON.parse(item);
    }
    return defaultValue;
};
exports.useLocalStorage = (key, initialValue) => {
    const [value, setValue] = React.useState(getFromStorage(key, initialValue));
    React.useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value));
    }, [value]);
    const update = (newValue) => {
        window.localStorage.setItem(key, JSON.stringify(newValue));
        setValue(newValue);
    };
    return [value, update];
};
