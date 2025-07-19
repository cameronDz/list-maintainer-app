/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
      plugins: [react()],
    base: "/list-maintainer-app/",
    server: {
        port: 3000,
        open: true,
    },
    build: {
        outDir: "build",
    },          
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./src/setupTests.ts"],
        coverage: {
            provider: "v8",
            reporter: ["text", "lcov", "html"],
            reportsDirectory: "coverage",
            exclude: [
                "src/**/*.d.ts",
                "src/index.tsx",
                "src/reportWebVitals.ts",
            ],
        },
    },
});
