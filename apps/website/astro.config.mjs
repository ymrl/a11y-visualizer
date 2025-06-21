import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

export default defineConfig({
  integrations: [tailwind(), react()],
  base: "/a11y-visualizer/",
  outDir: "./dist",
  server: {
    port: 4000,
  },
  build: {
    assets: "assets",
  },
});
