import * as React from "react";

export const colors = [
    0xFFFFFF, 0x000000,
    0x616161, 0xBDBDBD,
    0xF44336, 0x9C27B0,
    0x673AB7, 0x3F51B5,
    0x009688, 0x4CAF50,
    0xCDDC39, 0xFFEB3B,
    0xFF9800, 0xFF5722,
    0x795548, 0x607D8B,
];

export interface ColorState {
    setColor: (color: number) => void;
    color: number;
}

export const ColorContext = React.createContext<ColorState>({ setColor: () => { }, color: 0xFFFFFF });

export const ColorProvider = (props: { children: React.ReactNode }) => {
    const [color, setColor] = React.useState(colors[0]);

    return (
        <ColorContext.Provider value={{ setColor, color }}>
            {props.children}
        </ColorContext.Provider>
    );
};

export const ColorPicker = () => {
    const { setColor, color } = React.useContext(ColorContext);

    return (
        <div className="color-picker">
            {colors.map((c, i) => (
                <div
                    key={i}
                    className={`color-picker-color ${color === c ? "selected" : ""}`}
                    style={{ backgroundColor: `#${c.toString(16).padStart(6, "0")}` }}
                    onClick={() => setColor(c)}
                />
            ))}
        </div>
    );
};