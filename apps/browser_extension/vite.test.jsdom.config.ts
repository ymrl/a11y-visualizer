/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Vitest config for running in Node + jsdom (no Playwright/browser server)
export default defineConfig({
  plugins: [react()],
  build: {
    target: ["es2022", "chrome89", "edge89"],
  },
  test: {
    environment: "jsdom",
    pool: "threads",
    setupFiles: ["./vitest.setup.jsdom.ts"],
    exclude: [
      // Browser-dependent tests that require real layout/interaction
      "src/rules/target-size/**/*.test.ts",
      "src/dom/isFocusable.test.ts",
    ],
    // Keep default include (/**/*.{test,spec}.?(c|m)[jt]s?(x))
    // You can limit to specific directories if needed.
    browser: {
      enabled: false,
    },
  },
});
