import { Settings, CategorySettings } from "./types";

export const DEFAULT_SETTING_KEY = "__default__";
export const OBSOLETE_SETTING_KEY = "settings";
export const FILE_SETTING_KEY = "__file__";

export const defaultCustomCategorySettings: CategorySettings = {
  heading: true,
  image: true,
  formControl: true,
  button: true,
  link: true,
  ariaHidden: false,
  section: false,
  page: true,
  lang: true,
  table: false,
  list: false,
} as const;

export const initialSettings: Settings = {
  accessibilityInfo: true,
  interactiveMode: true,
  hideTips: true,
  showLiveRegions: true,
  announcementMaxSeconds: 10,
  announcementSecondsPerCharacter: 0.5,
  tipOpacityPercent: 30,
  liveRegionOpacityPercent: 50,
  tipFontSize: 10,
  liveRegionFontSize: 48,
  elementTypeMode: {
    mode: "preset",
    presetId: "basic",
  },
} as const;
