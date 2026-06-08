/// <reference types="vitest" />
import { playwright } from "@vitest/browser-playwright";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: ["es2022", "chrome89", "edge89"],
  },
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      screenshotFailures: false,
      instances: [
        {
          name: "chromium",
          browser: "chromium",
        },
        {
          name: "firefox",
          browser: "firefox",
        },
      ],
    },
  },
});
