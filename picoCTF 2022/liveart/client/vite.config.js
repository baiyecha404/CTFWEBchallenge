import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    sourceMap: true,
    build: {
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },
    css: {
        modules: {
            localsConvention: "camelCaseOnly"
        }
    },
    server: {
        port: 3000,
    }
});