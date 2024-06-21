import { ManifestV3Export } from "@crxjs/vite-plugin";
import { version } from "./version.json";

const manifestBase: ManifestV3Export = {
  manifest_version: 3,
  name: "Accessibility Visualizer",
  version,
  default_locale: "en",
  action: {
    default_popup: "src/popup/index.html",
    default_icon: {
      "16": "src/assets/icon-disabled@16w.png",
      "48": "src/assets/icon-disabled@48w.png",
      "128": "src/assets/icon-disabled@128w.png",
      "192": "src/assets/icon-disabled.png",
    },
  },
  icons: {
    "16": "src/assets/icon@16w.png",
    "48": "src/assets/icon@48w.png",
    "128": "src/assets/icon@128w.png",
    "192": "src/assets/icon.png",
  },
  content_scripts: [
    {
      js: ["src/content/index.ts"],
      matches: ["*://*/*", "file:///*"],
      exclude_matches: ["*://docs.google.com/*"],
    },
  ],
  options_ui: {
    page: "src/options/index.html",
  },
  permissions: ["storage", "activeTab"],
};

type ManifestV3Firefox = ManifestV3Export & {
  browser_specific_settings?: {
    gecko?: {
      id?: string;
      strict_min_version?: string;
      strict_max_version?: string;
      update_url?: string;
    };
    gecko_android?: {
      strict_min_version?: string;
      strict_max_version?: string;
    };
    safari?: {
      strict_min_version?: string;
      strict_max_version?: string;
    };
  };
};
export const manifestFirefox: ManifestV3Firefox = {
  ...manifestBase,
  background: {
    scripts: ["src/background.ts"],
    type: "module",
  },
  browser_specific_settings: {
    gecko: {
      id: "a11y-visualizer@ymrl.net",
    },
  },
};

export const manifestChrome: ManifestV3Export = {
  ...manifestBase,
  background: {
    service_worker: "src/background.ts",
    type: "module",
  },
  minimum_chrome_version: "89",
};
