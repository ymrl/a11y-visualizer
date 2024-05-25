export type CategorySettings = {
  image: boolean;
  formControl: boolean;
  link: boolean;
  button: boolean;
  heading: boolean;
  ariaHidden: boolean;
};

export type Settings = {
  accessibilityInfo: boolean;
  interactiveMode: boolean;
  hideTips: boolean;
  showLiveRegions: boolean;
  announcementMaxSeconds: number;
  announcementSecondsPerCharacter: number;
  tipOpacityPercent: number;
  liveRegionOpacityPercent: number;
} & CategorySettings;

export type SettingsMessage =
  | {
      type: "updateAccessibilityInfo";
      settings: Settings;
      enabled: boolean;
    }
  | {
      type: "updateHostSettings";
      settings: Settings;
      enabled: boolean;
      host: string;
    }
  | {
      type: "updateEnabled";
      enabled: boolean;
    }
  | {
      type: "updateDefaultSettings";
      settings: Settings;
      enabled: boolean;
    }
  | {
      type: "applySettings";
      settings: Settings;
      enabled: boolean;
    };
