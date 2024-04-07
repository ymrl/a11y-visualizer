export type Settings = {
  accessibilityInfo: boolean;
  image: boolean;
  formControl: boolean;
  link: boolean;
  heading: boolean;
  ariaHidden: boolean;
};

export type Message =
  | {
      type: "updateAccessibilityInfo";
      settings: Settings;
    }
  | {
      type: "getSettings";
      settings: Settings;
    };
