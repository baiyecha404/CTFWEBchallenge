import * as React from "react";
import { useLocalStorage } from "../../hooks";
import { randomSelect } from "../../utils";
import { TextInput } from "../text-input";

import "./index.scss";

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
]

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
]

const people = [
    `Me`,
    `You`,
    `No one`,
    `Zach`,
    `Not George Hotz`,
    `The beast that dwells`,
    `The entire country of Pennsylvania`, // Ireland?
];

type SubmissionState =
    | { kind: "initial" }
    | { kind: "waiting" }
    | { kind: "error", error: string }
    | { kind: "success" };

export const XSSSubmission = () => {
    const [url, setUrl] = useLocalStorage("xss-submission-url", "http://example.com");
    const [state, setState] = React.useState<SubmissionState>({ kind: "initial" });

    const introduction = React.useMemo(() => randomSelect(introductions), []);
    const link = React.useMemo(() => randomSelect(links), []);
    const signoff = React.useMemo(() => randomSelect(signoffs), []);
    const person = React.useMemo(() => randomSelect(people), []);

    const [emailPrefix, emailSuffix] = (
        introduction
        + link
        + "\n\n"
        + signoff
        + "\n"
        + person
    ).split("{{link}}");

    const submit = async () => {
        const result = await fetch("/fan-mail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url })
        });

        if (!result.ok) {
            setState({ kind: "error", error: await result.text() })
        } else {
            setState({ kind: "success" });
        }
    }

    let inner: JSX.Element;

    switch (state.kind) {
        case "initial": {
            inner = (
                <>
                    <div className="xss-link">
                        <div>Link: </div>
                        <TextInput className="xss-input" value={url} onChange={setUrl} placeholder={"http://example.com"} />
                    </div>
                    <div className="xss-email">
                        { emailPrefix }<span className="link-text">{ url }</span>{ emailSuffix }
                    </div>
                    <div className="button" onClick={submit}>Send</div>
                    <div className="xss-reminder">(Reminder! Due to infrastructure limitations you need to attack <span className="good-uri">http://localhost:4000</span> and not <span className="bad-uri">{ window.origin }</span>)</div>
                </>
            );
            break;
        }
        case "waiting": {
            inner = (
                <div className="xss-status">Submitting...</div>
            );
            break;
        }
        case "error": {
            inner = (
                <>
                    <div className="xss-status xss-error">{ state.error }</div>
                    <div className="button" onClick={() => setState({ kind: "initial" })}>Try Again</div>
                </>
            );
            break;
        }
        case "success": {
            inner = (
                <div className="xss-status xss-success">Success!</div>
            );
        }
    }

    return (
        <div className="frame xss-submission">
            <div className="xss-title">Send Me Fan Mail!</div>
            { inner }
        </div>
    )
};