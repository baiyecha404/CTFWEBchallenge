import * as React from "react";
import Peer from "peerjs";

export interface BroadcastState {
    uploadImage(image: string): void;
    active: boolean;
    id: string;
    viewers: number;
}

export const BroadcastContext = React.createContext<BroadcastState>({
    uploadImage: () => {},
    active: false,
    id: "unknown",
    viewers: 0,
});

export interface Props {
    children: React.ReactNode;
    id: string;
    active: boolean;
}

export const BroadcastProvider = (props: Props) => {
    const peerSet = React.useRef<Set<Peer.DataConnection>>(new Set());
    const imageCache = React.useRef<string | undefined>(undefined);
    const [_, update] = React.useState({});

    React.useEffect(() => {
        if (props.active) {
            const peer = new Peer(props.id);
            peer.on("connection", (conn) => {
                peerSet.current.add(conn);
                if (imageCache.current) {
                    conn.on("open", () => {
                        conn.send(imageCache.current);
                    });
                }

                conn.on("close", () => {
                    peerSet.current.delete(conn)
                    update({});
                });

                update({});
            });

            return () => {
                peerSet.current = new Set();
                peer.destroy();
            }
        }
    }, [props.active, props.id]);

    const uploadImage = (image: string) => {
        imageCache.current = image;
        for (const conn of peerSet.current) {
            conn.send(image);
        }
    };

    return (
        <BroadcastContext.Provider value={{ uploadImage, active: props.active, viewers: peerSet.current.size, id: props.id }}>
            { props.children }
        </BroadcastContext.Provider>
    );
};
