import * as React from "react";

type Dimensions = { width: number, height: number };

const baseResolution: Dimensions = { width: 384, height: 384 };

export interface Props {
    image?: string;
}

export const Viewer = (props: Props) => {
    const [dimensions, updateDimensions] = React.useReducer(
        (canvasDimensions: Dimensions, windowDimensions: Dimensions) => {
            const newScale = Math.floor(Math.min(
                (windowDimensions.width / baseResolution.width),
                (windowDimensions.height / baseResolution.height))
            );

            const desiredDimensions = { width: baseResolution.width * newScale, height: baseResolution.height * newScale };

            if (desiredDimensions.width !== canvasDimensions.width || desiredDimensions.height !== canvasDimensions.height) {
                return desiredDimensions;
            } else {
                return canvasDimensions;
            }
        },
        baseResolution
    );

    React.useEffect(() => {
        const listener = () => {
            updateDimensions({ width: window.innerWidth - 100, height: window.innerHeight - 200 });
        }

        window.addEventListener("resize", listener);

        return () => {
            window.removeEventListener("resize", listener);
        }
    }, []);

    return (
        <div>
            <h1>Viewing</h1>
            <img src={props.image} { ...dimensions }/>
        </div>
    )
}