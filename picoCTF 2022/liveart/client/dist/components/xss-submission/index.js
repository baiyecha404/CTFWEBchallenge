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
exports.XSSSubmission = void 0;
const React = __importStar(require("react"));
const hooks_1 = require("../../hooks");
const utils_1 = require("../../utils");
const text_input_1 = require("../text-input");
require("./index.scss");
const introductions = [
    `Dear Mr. zwad3,

How have you been? It's been a while! `,
    `Yo Z!

What's going down? `,
    `To Whomstd'vst it may concern,

`,
    `Zach? Is that you?

This is your mother. `,
    `Hello Mr. Sir,

I am an estranged prince of South Carolina by the name of Fred. `,
    `This is the IRS. Please stop what you are doing immediately.

`,
    `Çɵngŗàʇs! Yōŭ'ue A w1ŉŉeʁ!

`,
    `Where am I? What _is_ this place?

`,
    `Is this Zach?

We've been trying to reach you about your cars' extended warranty. `,
    `Dear zwad3,

This is the McTaco's support team. We've noticed some unusual activity on your account. `,
];
const links = [
    `Please click on this completely [real link]({{link}}) now.`,
    `Would you kindly download and run [this word document]({{link}})? Make sure that macros are enabled.`,
    `Check out this cool link I found {{link}}!`,
    `Click [here]({{link}}) to win 100 thousand dollars.`,
    `Can you log into your [bank account]({{link}}) for a completely unrelated reason?`,
    `Click [here]({{link}}) for free flags!!!!1!111!`,
    `Hey, what's that over there

{{link}}`,
];
const signoffs = [
    `Sincerely,`,
    `Regrettably,`,
    `Suspicously,`,
    `Implausibly,`,
    `Astoundingly,`,
    `Enigmatically,`,
    `With Love,`,
    `With Ambivalence,`,
    `With Respect,`,
    `With Disrespect,`,
    `xoxo,`
];
const people = [
    `Me`,
    `You`,
    `No one`,
    `Zach`,
    `Not George Hotz`,
    `The beast that dwells`,
    `The entire country of Pennsylvania`,
];
exports.XSSSubmission = () => {
    const [url, setUrl] = hooks_1.useLocalStorage("xss-submission-url", "http://example.com");
    const [state, setState] = React.useState({ kind: "initial" });
    const introduction = React.useMemo(() => utils_1.randomSelect(introductions), []);
    const link = React.useMemo(() => utils_1.randomSelect(links), []);
    const signoff = React.useMemo(() => utils_1.randomSelect(signoffs), []);
    const person = React.useMemo(() => utils_1.randomSelect(people), []);
    const [emailPrefix, emailSuffix] = (introduction
        + link
        + "\n\n"
        + signoff
        + "\n"
        + person).split("{{link}}");
    const submit = async () => {
        const result = await fetch("/fan-mail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url })
        });
        if (!result.ok) {
            setState({ kind: "error", error: await result.text() });
        }
        else {
            setState({ kind: "success" });
        }
    };
    let inner;
    switch (state.kind) {
        case "initial": {
            inner = (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "xss-link" },
                    React.createElement("div", null, "Link: "),
                    React.createElement(text_input_1.TextInput, { className: "xss-input", value: url, onChange: setUrl, placeholder: "http://example.com" })),
                React.createElement("div", { className: "xss-email" },
                    emailPrefix,
                    React.createElement("span", { className: "link-text" }, url),
                    emailSuffix),
                React.createElement("div", { className: "button", onClick: submit }, "Send"),
                React.createElement("div", { className: "xss-reminder" },
                    "(Reminder! Due to infrastructure limitations you need to attack ",
                    React.createElement("span", { className: "good-uri" }, "http://localhost:4000"),
                    " and not ",
                    React.createElement("span", { className: "bad-uri" }, window.origin),
                    ")")));
            break;
        }
        case "waiting": {
            inner = (React.createElement("div", { className: "xss-status" }, "Submitting..."));
            break;
        }
        case "error": {
            inner = (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "xss-status xss-error" }, state.error),
                React.createElement("div", { className: "button", onClick: () => setState({ kind: "initial" }) }, "Try Again")));
            break;
        }
        case "success": {
            inner = (React.createElement("div", { className: "xss-status xss-success" }, "Success!"));
        }
    }
    return (React.createElement("div", { className: "frame xss-submission" },
        React.createElement("div", { className: "xss-title" }, "Send Me Fan Mail!"),
        inner));
};
