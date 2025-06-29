/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: ["es2022", "chrome89", "edge89"],
  },
  test: {
    browser: {
      enabled: true,
      provider: "playwright",
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
