import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.firefox.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest, browser: "firefox" })],
  build: {
    target: ["es2022", "firefox109"],
    outDir: "dist-firefox",
  },
});
