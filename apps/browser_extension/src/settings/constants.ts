import type { CategorySettings, Settings } from "./types";

export const DEFAULT_SETTING_KEY = "__default__";
export const OBSOLETE_SETTING_KEY = "settings";
export const FILE_SETTING_KEY = "__file__";

// Detect Android Firefox for settings customization
const isAndroidFirefox = (() => {
  if (typeof navigator === "undefined") return false;
  return (
    navigator.userAgent.includes("Android") &&
    navigator.userAgent.includes("Firefox")
  );
})();

export const defaultCustomCategorySettings: CategorySettings = {
  heading: true,
  image: true,
  formControl: true,
  button: true,
  link: true,
  section: false,
  page: true,
  lang: true,
  table: false,
  list: false,
  waiAria: false,
  tabIndex: false,
} as const;

export const initialSettings: Settings = {
  accessibilityInfo: true,
  interactiveMode: true,
  hideTips: true,
  showLiveRegions: true,
  hideOutOfSightElementTips: false,
  announcementMaxSeconds: 10,
  announcementSecondsPerCharacter: 0.5,
  tipOpacityPercent: 30,
  liveRegionOpacityPercent: 50,
  tipFontSize: 10,
  liveRegionFontSize: isAndroidFirefox ? 24 : 48,
  elementTypeMode: {
    mode: "preset",
    presetId: "basic",
  },
  language: "auto",
} as const;
