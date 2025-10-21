export type CategorySettings = {
  image: boolean;
  formControl: boolean;
  link: boolean;
  button: boolean;
  heading: boolean;
  section: boolean;
  lang: boolean;
  page: boolean;
  table: boolean;
  list: boolean;
  waiAria: boolean;
  tabIndex: boolean;
};

export type PresetId = "basic" | "structure" | "content" | "custom";

export type ElementTypeMode =
  | {
      mode: "preset";
      presetId: Exclude<PresetId, "custom">;
    }
  | {
      mode: "custom";
      settings: CategorySettings;
    };

export type SupportedLanguage = "en" | "ja" | "ko" | "auto";

export type Settings = {
  accessibilityInfo: boolean;
  interactiveMode: boolean;
  hideTips: boolean;
  showLiveRegions: boolean;
  hideOutOfSightElementTips: boolean;
  announcementMaxSeconds: number;
  announcementSecondsPerCharacter: number;
  tipOpacityPercent: number;
  activeTipOpacityPercent: number;
  liveRegionOpacityPercent: number;
  tipFontSize: number;
  liveRegionFontSize: number;
  elementTypeMode: ElementTypeMode;
  language: SupportedLanguage;
};

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
