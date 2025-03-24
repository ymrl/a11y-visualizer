/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import { manifestChrome } from "./manifests";

const server = {
  cors: {
    origin: [
      // ⚠️ SECURITY RISK: Allows any chrome-extension to access the vite server ⚠️
      // See https://github.com/crxjs/chrome-extension-tools/issues/971 for more info
      // I don't believe that the linked issue mentions a potential solution
      /chrome-extension:\/\//,
    ],
  },
};
const legacy = {
  // ⚠️ SECURITY RISK: Allows WebSockets to connect to the vite server without a token check ⚠️
  // See https://github.com/crxjs/chrome-extension-tools/issues/971 for more info
  // The linked issue gives a potential fix that @crxjs/vite-plugin could implement
  skipWebSocketTokenCheck: true,
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    crx({
      manifest: manifestChrome,
    }),
  ],
  build: {
    target: ["es2022", "chrome89", "edge89"],
  },
  ...(process.env.NODE_ENV === "development" ? { server, legacy } : {}),
});
