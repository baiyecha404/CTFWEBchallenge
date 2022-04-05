import * as React from "react";
import "./index.scss";

export interface Props {
    className?: string;
    onChange: (value: string) => void;
    value: string;
    placeholder?: string;
}

export const TextInput = (props: Props) => {
    return (
        <input
            type="text"
            className={`text-input ${props.className ?? ""}`}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
        />
    );
};
