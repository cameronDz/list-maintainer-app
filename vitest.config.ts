/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    typecheck: {
      tsconfig: "./tsconfig.test.json"
    },
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
