import { Settings, CategorySettings } from "./types";
import {
  DEFAULT_SETTING_KEY,
  FILE_SETTING_KEY,
  initialSettings,
  defaultCustomCategorySettings,
} from "./constatns";
import { getAsync, removeAsync, setAsync } from "../browser/localStorage";

// 古い形式の設定を新しい形式に変換
function migrateLegacySettings(settings: unknown): Settings {
  const settingsObj = settings as Record<string, unknown>;
  // 古い形式には elementTypeMode がない場合
  if (!settingsObj.elementTypeMode) {
    const categorySettings: CategorySettings = {
      image:
        (settingsObj.image as boolean) ?? defaultCustomCategorySettings.image,
      formControl:
        (settingsObj.formControl as boolean) ??
        defaultCustomCategorySettings.formControl,
      link: (settingsObj.link as boolean) ?? defaultCustomCategorySettings.link,
      button:
        (settingsObj.button as boolean) ?? defaultCustomCategorySettings.button,
      heading:
        (settingsObj.heading as boolean) ??
        defaultCustomCategorySettings.heading,
      ariaHidden:
        (settingsObj.ariaHidden as boolean) ??
        defaultCustomCategorySettings.ariaHidden,
      section:
        (settingsObj.section as boolean) ??
        defaultCustomCategorySettings.section,
      lang: (settingsObj.lang as boolean) ?? defaultCustomCategorySettings.lang,
      page: (settingsObj.page as boolean) ?? defaultCustomCategorySettings.page,
      table:
        (settingsObj.table as boolean) ?? defaultCustomCategorySettings.table,
      list: (settingsObj.list as boolean) ?? defaultCustomCategorySettings.list,
    };

    return {
      accessibilityInfo:
        (settingsObj.accessibilityInfo as boolean) ??
        initialSettings.accessibilityInfo,
      interactiveMode:
        (settingsObj.interactiveMode as boolean) ??
        initialSettings.interactiveMode,
      hideTips: (settingsObj.hideTips as boolean) ?? initialSettings.hideTips,
      showLiveRegions:
        (settingsObj.showLiveRegions as boolean) ??
        initialSettings.showLiveRegions,
      announcementMaxSeconds:
        (settingsObj.announcementMaxSeconds as number) ??
        initialSettings.announcementMaxSeconds,
      announcementSecondsPerCharacter:
        (settingsObj.announcementSecondsPerCharacter as number) ??
        initialSettings.announcementSecondsPerCharacter,
      tipOpacityPercent:
        (settingsObj.tipOpacityPercent as number) ??
        initialSettings.tipOpacityPercent,
      liveRegionOpacityPercent:
        (settingsObj.liveRegionOpacityPercent as number) ??
        initialSettings.liveRegionOpacityPercent,
      tipFontSize:
        (settingsObj.tipFontSize as number) ?? initialSettings.tipFontSize,
      liveRegionFontSize:
        (settingsObj.liveRegionFontSize as number) ??
        initialSettings.liveRegionFontSize,
      elementTypeMode: {
        mode: "custom",
        settings: categorySettings,
      },
    };
  }

  return settingsObj as Settings;
}

export const loadDefaultSettings = async (): Promise<[Settings, boolean]> => {
  const [settings, found] = await getAsync(
    DEFAULT_SETTING_KEY,
    initialSettings,
  );
  return [migrateLegacySettings(settings), found];
};

export const loadUrlSettings = async (
  url: string | undefined,
): Promise<[Settings, boolean]> => {
  const [baseSettings] = await loadDefaultSettings();
  if (url) {
    const parsedURL = new URL(url);
    if (["http:", "https:"].includes(parsedURL.protocol) && parsedURL.host) {
      const [settings, found] = await getAsync(parsedURL.host, baseSettings);
      return [migrateLegacySettings(settings), found];
    }
    if (parsedURL.protocol === "file:") {
      const [settings, found] = await getAsync(FILE_SETTING_KEY, baseSettings);
      return [migrateLegacySettings(settings), found];
    }
  }

  // 初めて訪問するホストの場合、デフォルト設定がカスタムモードかチェック
  if (baseSettings.elementTypeMode.mode === "custom") {
    // すでにカスタムモードの場合、そのまま返す
    return [baseSettings, false];
  }

  return [baseSettings, false];
};

export const saveDefaultSettings = async (settings: Settings) => {
  return await setAsync(DEFAULT_SETTING_KEY, settings);
};

export const saveUrlSettings = async (
  url: string | undefined,
  settings: Settings,
) => {
  if (url) {
    const parsedURL = new URL(url);
    if (["http:", "https:"].includes(parsedURL.protocol) && parsedURL.host) {
      return await setAsync(parsedURL.host, settings);
    }
    if (parsedURL.protocol === "file:") {
      return await setAsync(FILE_SETTING_KEY, settings);
    }
  }
};

export const resetUrlSettings = async (url: string | undefined) => {
  if (url) {
    const parsedURL = new URL(url);
    if (["http:", "https:"].includes(parsedURL.protocol) && parsedURL.host) {
      removeAsync(parsedURL.host);
    }
    if (parsedURL.protocol === "file:") {
      removeAsync(FILE_SETTING_KEY);
    }
  }
};
export const resetDefaultSettings = async () => {
  await removeAsync(DEFAULT_SETTING_KEY);
};
