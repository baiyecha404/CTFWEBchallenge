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
exports.SettingsOptions = void 0;
const React = __importStar(require("react"));
const wrappers_1 = require("../../wrappers");
const text_input_1 = require("../text-input");
const settings_provider_1 = require("./settings-provider");
exports.SettingsOptions = (props) => {
    const { settings, updateSettings } = React.useContext(settings_provider_1.SettingsContext);
    const [activeUsername, setActiveUsername] = React.useState(settings.username);
    React.useEffect(() => {
        setActiveUsername(settings.username);
    }, [settings.username]);
    React.useEffect(() => {
    });
    const updateUsername = () => {
        var _a, _b;
        if (activeUsername.length > 24) {
            (_a = props.throwError) === null || _a === void 0 ? void 0 : _a.call(props, new wrappers_1.ComponentError("Username must be less than 24 characters"));
        }
        if (activeUsername.match(/^[a-z0-9-]+$/) === null) {
            (_b = props.throwError) === null || _b === void 0 ? void 0 : _b.call(props, new wrappers_1.ComponentError("Username must be lowercase alphanumeric and hyphens"));
        }
        updateSettings({ username: activeUsername });
    };
    return (React.createElement("div", { className: "settings-options" },
        React.createElement("div", { className: "settings-option" },
            React.createElement("input", { type: "checkbox", id: "allow-connections", checked: settings.allowViewers, onChange: () => updateSettings({ allowViewers: !settings.allowViewers }) }),
            React.createElement("label", { htmlFor: "allow-connections" }, "Allow connections from viewers")),
        React.createElement("div", { className: "settings-option" },
            React.createElement(text_input_1.TextInput, { placeholder: "Connection Username", value: activeUsername, onChange: (e) => setActiveUsername(e) }),
            React.createElement("div", { className: `button ${activeUsername === settings.username ? "disabled" : ""}`, onClick: updateUsername }, "Update"))));
};
