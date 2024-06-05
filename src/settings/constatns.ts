import { Settings } from "./types";

export const DEFAULT_SETTING_KEY = "__default__";
export const OBSOLETE_SETTING_KEY = "settings";

export const initialSettings: Settings = {
  accessibilityInfo: true,
  image: true,
  formControl: true,
  link: false,
  button: true,
  heading: true,
  ariaHidden: true,
  section: true,
  lang: true,
  page: true,
  table: true,
  interactiveMode: true,
  hideTips: true,
  showLiveRegions: true,
  announcementMaxSeconds: 10,
  announcementSecondsPerCharacter: 0.5,
  tipOpacityPercent: 30,
  liveRegionOpacityPercent: 50,
  tipFontSize: 10,
  liveRegionFontSize: 48,
} as const;
