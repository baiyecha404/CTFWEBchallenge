import * as React from "react";
import { generateUsername } from "../../utils";
import { ComponentError } from "../../wrappers";
import { TextInput } from "../text-input";
import { SettingsContext } from "./settings-provider";

export interface Props {
    throwError?: (error: ComponentError) => void;
}

export const SettingsOptions = (props: Props) => {
    const { settings, updateSettings } = React.useContext(SettingsContext);
    const [activeUsername, setActiveUsername] = React.useState<string>(settings.username);

    React.useEffect(() => {
        setActiveUsername(settings.username);
    }, [settings.username]);

    React.useEffect(() => {

    })

    const updateUsername = () => {
        if (activeUsername.length > 24) {
            props.throwError?.(new ComponentError("Username must be less than 24 characters"));
        }

        if (activeUsername.match(/^[a-z0-9-]+$/) === null) {
            props.throwError?.(new ComponentError("Username must be lowercase alphanumeric and hyphens"));
        }

        updateSettings({ username: activeUsername });
    }

    return (
        <div className="settings-options">
            <div
                className="settings-option"
            >
                <input
                    type="checkbox"
                    id="allow-connections"
                    checked={settings.allowViewers}
                    onChange={() => updateSettings({ allowViewers: !settings.allowViewers })}
                />
                <label htmlFor="allow-connections">Allow connections from viewers</label>
            </div>
            <div className="settings-option">
                <TextInput
                    placeholder={"Connection Username"}
                    value={activeUsername}
                    onChange={(e) => setActiveUsername(e)}
                />
                <div
                    className={`button ${activeUsername === settings.username ? "disabled" : ""}`}
                    onClick={updateUsername}
                >
                    Update
                </div>
            </div>
        </div>
    );
}