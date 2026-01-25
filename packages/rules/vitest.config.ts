/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: "playwright",
      headless: true,
      screenshotFailures: false,
      instances: [
        { name: "chromium", browser: "chromium" },
        { name: "firefox", browser: "firefox" },
      ],
    },
  },
});
