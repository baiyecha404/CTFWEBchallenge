import * as React from "react";
import { useNavigate } from "react-router-dom";
import { TextInput } from "../text-input";

import "./index.scss";

export const Home = () => {
    const [page, setPage] = React.useState("");
    const nav = useNavigate();

    return (
        <div className="frame home">
            <div
                className="button"
                onClick={() => nav("/editor")}
            >
                Editor
            </div>
            <div
                className="button"
                onClick={() => nav("/settings")}
            >
                Settings
            </div>
            <div className="spacer"/>
            <div className="view">
                <TextInput
                    value={page}
                    onChange={setPage}
                    placeholder="happy-green-whale"
                />
                <div
                    className="button"
                    onClick={() => nav(`/drawing/${page}`)}
                >
                    Join Stream
                </div>
            </div>
            <div className="spacer"/>
            <div
                className="button"
                onClick={() => nav("/link-submission")}
            >
                Like LiveArt? Send me fan mail!
            </div>
        </div>
    )
}