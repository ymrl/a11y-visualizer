/// <reference types="vitest" />
import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
import { WxtVitest } from "wxt/testing";

// Unit tests configuration with browser mode
export default defineConfig({
  plugins: [WxtVitest()],
  test: {
    include: ["wxt-tests/**/*.test.ts", "wxt-tests/**/*.test.tsx"],
  },
});