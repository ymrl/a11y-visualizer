export type CategorySettings = {
  image: boolean;
  formControl: boolean;
  link: boolean;
  button: boolean;
  heading: boolean;
  ariaHidden: boolean;
  section: boolean;
  lang: boolean;
  page: boolean;
  table: boolean;
  list: boolean;
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
  tipFontSize: number;
  liveRegionFontSize: number;
} & CategorySettings;

export type SettingsMessage =
  | {
      type: "updateUrlSettings";
      settings: Settings;
      enabled: boolean;
      url: string;
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
