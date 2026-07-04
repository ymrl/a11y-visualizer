import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "wxt";
import pkg from "./package.json";

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
    optimizeDeps: {
      // Vite のデフォルトでは `**/*.html` をスキャンするため、過去の build /
      // test / zip で生成された `dist/` 配下の古い HTML まで対象になり、
      // ファイルが欠落していると ENOENT で dev サーバーが失敗する。
      // ソースの entrypoints のみをスキャン対象にして dist を除外する。
      entries: ["entrypoints/**/*.html"],
    },
    test: {
      browser: {
        enabled: true,
        provider: playwright(),
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
    version: pkg.version,
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
      gecko_android: {
        strict_min_version: "113.0",
      },
    },
  },
  zip: {
    artifactTemplate: "a11y-visualizer-{{version}}-{{browser}}.zip",
  },
});
