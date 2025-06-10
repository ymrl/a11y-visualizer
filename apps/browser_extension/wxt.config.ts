import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  imports: false,
  modules: ["@wxt-dev/module-react"],
  outDir: "dist",
  // Firefox でも Manifest V3 を使用する場合
  // manifestVersion: 3,
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
    name: "Accessibility Visualizer",
    version: "5.5.0",
    default_locale: "en",
    permissions: ["storage", "activeTab"],
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
      default_title: "Accessibility Visualizer",
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
        id: "a11y-visualizer@ymrl.net",
      },
    },
  },
  zip: {
    artifactTemplate: "a11y-visualizer-{{version}}-{{browser}}.zip",
  },
});
