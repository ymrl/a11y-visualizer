import { defineConfig } from "wxt";
import pkg from "./package.json";

export default defineConfig({
  imports: false,
  modules: ["@wxt-dev/module-react"],
  outDir: "dist",
  vite: () => ({
    css: {
      postcss: "./postcss.config.js",
    },
    test: {
      browser: {
        enabled: true,
        provider: "playwright",
        headless: true,
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
  }),
  manifest: {
    name: "Target Enlarger",
    version: pkg.version,
    permissions: ["storage", "activeTab", "scripting"],
    host_permissions: ["http://*/*", "https://*/*"],
    action: {
      default_icon: {
        "16": "icon/16.png",
        "32": "icon/32.png",
        "48": "icon/48.png",
        "96": "icon/96.png",
        "128": "icon/128.png",
        "192": "icon/192.png",
      },
    },
    browser_action: {
      default_icon: {
        "16": "icon/16.png",
        "32": "icon/32.png",
        "48": "icon/48.png",
        "96": "icon/96.png",
        "128": "icon/128.png",
        "192": "icon/192.png",
      },
      default_title: "Target Enlarger",
      default_popup: "popup.html",
    },
    icons: {
      "16": "icon/16.png",
      "32": "icon/32.png",
      "48": "icon/48.png",
      "96": "icon/96.png",
      "128": "icon/128.png",
      "192": "icon/192.png",
    },
    options_ui: {
      page: "options.html",
    },
    minimum_chrome_version: "89",
    browser_specific_settings: {
      gecko: {
        id: "target-enlarger@ymrl.net",
      },
    },
  },
  zip: {
    artifactTemplate: "target-enlarger-{{version}}-{{browser}}.zip",
  },
});
