import * as React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import { Drawing } from "../drawing";
import { Editor } from "../editor";
import { ErrorPage } from "../error";
import { Settings, SettingsProvider } from "../settings";
import logoSrc from "../../assets/logo.png";

import "./index.scss";
import { Home } from "../home";
import { XSSSubmission } from "../xss-submission";

const _App = () => {
    const nav = useNavigate();

    return (
        <div className="page">
            <img
                src={logoSrc}
                className="logo"
                onClick={() => nav("/")}
            />
            <div className="page-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/error" element={<ErrorPage />} />
                    <Route path="/drawing/:page" element={<Drawing />} />
                    <Route path="/editor" element={<Editor />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/link-submission" element={<XSSSubmission /> } />
                </Routes>
            </div>
        </div>
    )
};

export const App = () => {
    return (
        <BrowserRouter>
            <SettingsProvider>
                <_App/>
            </SettingsProvider>
        </BrowserRouter>
    );
}