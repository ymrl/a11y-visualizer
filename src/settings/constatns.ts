import { Settings } from "./types";

export const DEFAULT_SETTING_KEY = "__default__";
export const OBSOLETE_SETTING_KEY = "settings";

export const initialSettings: Settings = {
  accessibilityInfo: true,
  image: true,
  formControl: false,
  link: false,
  button: false,
  heading: true,
  ariaHidden: true,
  interactiveMode: true,
  hideTips: true,
  showLiveRegions: true,
  announcementMaxSeconds: 10,
  announcementSecondsPerCharacter: 0.5,
  tipOpacityPercent: 50,
  liveRegionOpacityPercent: 50,
} as const;
