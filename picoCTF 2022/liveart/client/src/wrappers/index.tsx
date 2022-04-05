import * as React from "react";

export class ComponentError {
    constructor(public message: string) { }
}

export const WrapComponentError = <T extends (props: any) => JSX.Element>(component: T, returnTo = "/") => {
    return (props: T extends (props: infer P) => JSX.Element ? P : {}) => {
        const handleError = (e: unknown) => {
            console.error(e);
            const error = e instanceof ComponentError ? e.message : "Something went wrong";
            window.location.href = `/error#error=${encodeURIComponent(error)}&returnTo=${encodeURIComponent(returnTo)}`;
            throw e;
        }

        try {
            return component({ ...props, throwError: handleError });
        } catch (e) {
            handleError(e);
        }
    }
}