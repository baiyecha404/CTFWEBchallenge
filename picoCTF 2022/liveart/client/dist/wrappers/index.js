"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrapComponentError = exports.ComponentError = void 0;
class ComponentError {
    constructor(message) {
        this.message = message;
    }
}
exports.ComponentError = ComponentError;
exports.WrapComponentError = (component, returnTo = "/") => {
    return (props) => {
        const handleError = (e) => {
            console.error(e);
            const error = e instanceof ComponentError ? e.message : "Something went wrong";
            window.location.href = `/error#error=${encodeURIComponent(error)}&returnTo=${encodeURIComponent(returnTo)}`;
            throw e;
        };
        try {
            return component(Object.assign(Object.assign({}, props), { throwError: handleError }));
        }
        catch (e) {
            handleError(e);
        }
    };
};
