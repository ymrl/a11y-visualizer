import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://ymrl.github.io/a11y-visualizer/",
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes("/iframe-"),
    }),
  ],
  base: "/a11y-visualizer/",
  outDir: "./dist",
  server: {
    port: 4000,
  },
  build: {
    assets: "assets",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
