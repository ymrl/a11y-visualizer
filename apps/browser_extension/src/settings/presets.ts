import type { CategorySettings, PresetId } from "./types";

export interface Preset {
  id: Exclude<PresetId, "custom">;
  labelKey: string;
  settings: CategorySettings;
}

export const presets: Preset[] = [
  {
    id: "basic",
    labelKey: "presets.basic",
    settings: {
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
      waiAria: true,
      tabIndex: true,
    },
  },
  {
    id: "structure",
    labelKey: "presets.structure",
    settings: {
      heading: true,
      image: false,
      formControl: false,
      button: false,
      link: false,
      section: true,
      page: true,
      lang: true,
      table: false,
      list: false,
      waiAria: false,
      tabIndex: false,
    },
  },
  {
    id: "content",
    labelKey: "presets.content",
    settings: {
      heading: false,
      image: true,
      formControl: false,
      button: false,
      link: true,
      section: false,
      page: false,
      lang: false,
      table: true,
      list: true,
      waiAria: false,
      tabIndex: false,
    },
  },
];

export function getCategorySettingsFromMode(
  elementTypeMode: import("./types").ElementTypeMode,
  defaultCustomSettings: CategorySettings,
): CategorySettings {
  if (elementTypeMode.mode === "preset") {
    const preset = presets.find((p) => p.id === elementTypeMode.presetId);
    return preset ? preset.settings : defaultCustomSettings;
  } else {
    return elementTypeMode.settings;
  }
}

export function getPresetFromCategorySettings(
  categorySettings: CategorySettings,
): Exclude<PresetId, "custom"> | null {
  for (const preset of presets) {
    const matches = Object.entries(preset.settings).every(([key, value]) => {
      return categorySettings[key as keyof CategorySettings] === value;
    });

    if (matches) {
      return preset.id;
    }
  }

  return null;
}
