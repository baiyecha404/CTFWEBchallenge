import * as React from "react";

const getHashParams = <T extends Record<string, string>>() => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const result = Object.create(null);
    params.forEach((value, key) => {
        result[key] = value;
    });

    return result as T;
};

export const useHashParams = <T extends Record<string, string>>() => {
    const [params, setParams] = React.useState(getHashParams<T>());

    React.useEffect(() => {
        const listener = () => {
            setParams(getHashParams<T>());
        }

        window.addEventListener("hashchange", listener);

        return () => {
            window.removeEventListener("hashchange", listener);
        }
    });

    return params;
};

const getFromStorage = <T,>(key: string, defaultValue: T) => {
    const item = window.localStorage.getItem(key);
    if (item) {
        return JSON.parse(item) as T;
    }
    return defaultValue;
}

export const useLocalStorage = <T,>(key: string, initialValue: T) => {
    const [value, setValue] = React.useState<T>(getFromStorage(key, initialValue));

    React.useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value));
    }, [value]);

    const update = (newValue: T) => {
        window.localStorage.setItem(key, JSON.stringify(newValue));
        setValue(newValue);
    }

    return [value, update] as [T, (newValue: T) => void];
}