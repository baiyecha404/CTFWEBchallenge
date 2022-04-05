import * as React from "react";

import { CanvasManager } from "../../canvas";
import { useLocalStorage } from "../../hooks";
import { BroadcastContext } from "./broadcast-provider";
import { ColorContext } from "./colors";

export interface Props {

}

export const Canvas = (props: Props) => {
    const { uploadImage } = React.useContext(BroadcastContext);
    const [canvas, setCanvas] = React.useState<HTMLCanvasElement | null>(null);
    const managerRef = React.useRef<CanvasManager | null>(null);
    const [image, setImage] = useLocalStorage<number[][] | null>("image", null);
    const { color } = React.useContext(ColorContext);

    React.useEffect(() => {
        if (!canvas) return;

        managerRef.current = new CanvasManager(canvas, color);
        managerRef.current.on("change", (image) => {
            setImage(image);

            // We can't get the image until the canvas renders
            requestAnimationFrame(() => {
                uploadImage(canvas.toDataURL("image/png"))
            });
        });

        if (image) {
            managerRef.current.update(image);
        }

        return () => managerRef.current?.destroy();
    }, [canvas])

    React.useEffect(() => {
        managerRef.current?.setColor(color);
    }, [color]);

    React.useEffect(() => {
        if (image) {
            managerRef.current?.update(image);
        }
    }, [image]);

    return (
        <canvas ref={setCanvas} className="canvas" width={64} height={64} />
    )
}