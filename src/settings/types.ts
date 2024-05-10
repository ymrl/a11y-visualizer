export type Settings = {
  accessibilityInfo: boolean;
  image: boolean;
  formControl: boolean;
  link: boolean;
  button: boolean;
  heading: boolean;
  ariaHidden: boolean;
  interactiveMode: boolean;
  showLiveRegions: boolean;
  announcementMaxSeconds: number;
  announcementSecondsPerCharacter: number;
  tipOpacityPercent: number;
  liveRegionOpacityPercent: number;
};

export type Message =
  | {
      type: "updateAccessibilityInfo";
      settings: Settings;
      enabled: boolean;
    }
  | {
      type: "getSettings";
      settings: Settings;
    };
