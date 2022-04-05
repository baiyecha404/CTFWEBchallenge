import * as React from "react";
import { useParams } from "react-router-dom";
import Peer from "peerjs";

import { WrapComponentError } from "../../wrappers";
import { Viewer } from "../viewer";
import { ErrorPage } from "../error";

const getWrappedError = WrapComponentError(ErrorPage)
const getWrappedViewer = WrapComponentError(Viewer);

const isWideEnough = () => window.innerWidth > 600;

interface Props {
    page: string;
}

const _Drawing = (props: Props) => {
    const [image, setImage] = React.useState<string | undefined>();
    const [bigEnough, setBigEnough] = React.useState(isWideEnough());

    const page = props.page;

    React.useEffect(() => {
        if (!page) return;

        const peer = new Peer();
        peer.on("open", () => {
            const conn = peer.connect(page);
            conn.on("data", (data) => {
                if (typeof data === "string") {
                    setImage(data);
                }
            });
        })
    }, [page]);

    React.useEffect(() => {
        const listener = () => {
            setBigEnough(isWideEnough());
        }

        window.addEventListener("resize", listener);

        return () => {
            window.removeEventListener("resize", listener);
        }
    });

    const view = bigEnough
        ? getWrappedViewer({ image })
        : getWrappedError({ error: "Please make your window bigger" });

    return (
        <div>
            { view }
        </div>
    );
};

export const Drawing = () => {
    const params = useParams();
    return (<_Drawing page={ params.page! } />);
}
