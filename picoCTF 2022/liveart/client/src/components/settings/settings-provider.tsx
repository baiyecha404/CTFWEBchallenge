import * as React from "react";
import { useLocalStorage } from "../../hooks";
import { generateUsername } from "../../utils";

export interface Settings {
    allowViewers: boolean;
    username: string;
}

export interface SettingsState {
    settings: Settings;
    updateSettings: (settings: Partial<Settings>) => void;
}

export const SettingsContext = React.createContext<SettingsState>({
    settings: {allowViewers: false, username: "" },
    updateSettings: () => {},
});

export const SettingsProvider = (props: { children: React.ReactNode }) => {
    const [allowViewers, setAllowViewers] = useLocalStorage("allow-viewers", false);
    const [username, setUsername] = useLocalStorage("username", generateUsername());

    const settings = { allowViewers, username };
    const updateSettings = (settings: Partial<Settings>) => {
        if (settings.allowViewers !== undefined) {
            setAllowViewers(settings.allowViewers);
        }

        if (settings.username !== undefined) {
            setUsername(settings.username);
        }
    }

    return (
        <SettingsContext.Provider value={{ settings, updateSettings }}>
            { props.children }
        </SettingsContext.Provider>
    )
};