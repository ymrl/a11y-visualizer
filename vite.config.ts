/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import { manifestChrome } from "./manifests";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest: manifestChrome })],
  build: {
    target: ["es2022", "chrome89", "edge89"],
  },
  test: {
    environment: "jsdom",
  },
});
