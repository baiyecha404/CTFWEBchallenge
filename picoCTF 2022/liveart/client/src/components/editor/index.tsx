import * as React from "react";
import { SettingsContext } from "../settings/settings-provider";
import { BroadcastContext, BroadcastProvider } from "./broadcast-provider";
import { Canvas } from "./canvas";
import { ColorPicker, ColorProvider } from "./colors";

import "./index.scss";

export interface Props {

}

const _Editor = (props: Props) => {
    const { active, id, viewers } = React.useContext(BroadcastContext);

    const message =
        !active ? <h1 className="no-broadcast">Not Broadcasting</h1> :
        <h1 className="broadcast">
            Broadcasting as: <span className="broadcast-id">{ id }</span> (<span className="viewers">{ viewers }</span>)
        </h1>

    return (
        <ColorProvider>
            <div className="editor">
                { message }
                <Canvas/>
                <ColorPicker/>
            </div>
        </ColorProvider>
    );
}

export const Editor = (props: Props) => {
    const { settings } = React.useContext(SettingsContext);

    return (
        <BroadcastProvider active={ settings.allowViewers } id={ settings.username }>
            <_Editor { ...props }/>
        </BroadcastProvider>
    );
}