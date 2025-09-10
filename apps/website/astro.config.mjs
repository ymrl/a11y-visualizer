import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://ymrl.github.io/a11y-visualizer/",
  integrations: [
    tailwind(),
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
});
