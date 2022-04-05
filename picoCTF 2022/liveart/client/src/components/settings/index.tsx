import * as React from "react";

import { WrapComponentError } from "../../wrappers";
import { SettingsOptions } from "./settings-options";

import "./index.scss";

const getWrappedOptions = WrapComponentError(SettingsOptions, "/settings");

export const Settings = () => {
    const options = getWrappedOptions({});

    return (
        <div className="frame settings">
            <h1>Settings</h1>
            { options }
        </div>
    )
}

export { SettingsProvider } from "./settings-provider";