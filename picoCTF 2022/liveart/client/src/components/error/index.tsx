import * as React from "react";
import { useHashParams } from "../../hooks/index";

export interface Props {
    error?: string;
    returnTo?: string;
}

export const ErrorPage = (props: Props) => {
    const params = useHashParams<{ error: string, returnTo: string }>();
    const error = props.error ?? params.error;
    const returnTo = props.returnTo ?? params.returnTo;

    return (
        <div>
            <h1>Uh Oh Spaghetti-Oh!</h1>
            <h3>{ error }</h3>
            <div>
                <a href={ returnTo }>Return to previous page</a> or <a href="/">go home</a>.
            </div>
        </div>
    )
}