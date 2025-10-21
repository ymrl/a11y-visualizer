import { getAsync, removeAsync, setAsync } from "../browser/localStorage";
import {
  DEFAULT_SETTING_KEY,
  defaultCustomCategorySettings,
  FILE_SETTING_KEY,
  initialSettings,
} from "./constants";
import { presets } from "./presets";
import type { CategorySettings, Settings } from "./types";

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
      section:
        (settingsObj.section as boolean) ??
        defaultCustomCategorySettings.section,
      lang: (settingsObj.lang as boolean) ?? defaultCustomCategorySettings.lang,
      page: (settingsObj.page as boolean) ?? defaultCustomCategorySettings.page,
      table:
        (settingsObj.table as boolean) ?? defaultCustomCategorySettings.table,
      list: (settingsObj.list as boolean) ?? defaultCustomCategorySettings.list,
      waiAria:
        (settingsObj.waiAria as boolean) ??
        (settingsObj.ariaHidden as boolean) ??
        defaultCustomCategorySettings.waiAria,
      tabIndex:
        (settingsObj.tabIndex as boolean) ??
        defaultCustomCategorySettings.tabIndex,
    };

    const interactiveMode =
      (settingsObj.interactiveMode as boolean) ??
      initialSettings.interactiveMode;
    const tipOpacityPercent =
      (settingsObj.tipOpacityPercent as number) ??
      initialSettings.tipOpacityPercent;

    return {
      accessibilityInfo:
        (settingsObj.accessibilityInfo as boolean) ??
        initialSettings.accessibilityInfo,
      interactiveMode,
      hideTips: (settingsObj.hideTips as boolean) ?? initialSettings.hideTips,
      showLiveRegions:
        (settingsObj.showLiveRegions as boolean) ??
        initialSettings.showLiveRegions,
      hideOutOfSightElementTips:
        (settingsObj.hideOutOfSightElementTips as boolean) ??
        initialSettings.hideOutOfSightElementTips,
      announcementMaxSeconds:
        (settingsObj.announcementMaxSeconds as number) ??
        initialSettings.announcementMaxSeconds,
      announcementSecondsPerCharacter:
        (settingsObj.announcementSecondsPerCharacter as number) ??
        initialSettings.announcementSecondsPerCharacter,
      tipOpacityPercent,
      activeTipOpacityPercent:
        (settingsObj.activeTipOpacityPercent as number) ??
        (!interactiveMode
          ? tipOpacityPercent
          : initialSettings.activeTipOpacityPercent),
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
      language:
        (settingsObj.language as Settings["language"]) ??
        initialSettings.language,
    };
  }

  // 新しい設定形式でも activeTipOpacityPercent が存在しない場合の処理
  const newSettings: Settings = { ...settingsObj } as Settings;
  if (typeof newSettings.activeTipOpacityPercent === "undefined") {
    const interactiveMode =
      newSettings.interactiveMode ?? initialSettings.interactiveMode;
    const tipOpacityPercent =
      newSettings.tipOpacityPercent ?? initialSettings.tipOpacityPercent;
    newSettings.activeTipOpacityPercent = !interactiveMode
      ? tipOpacityPercent
      : initialSettings.activeTipOpacityPercent;
  }

  return newSettings;
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

// カスタム設定の保存・読み込み用関数
const getCustomSettingsKey = (url: string | undefined): string | null => {
  if (!url) return null;
  try {
    const parsedURL = new URL(url);
    if (["http:", "https:"].includes(parsedURL.protocol) && parsedURL.host) {
      return `${parsedURL.host}:custom`;
    }
    if (parsedURL.protocol === "file:") {
      return `${FILE_SETTING_KEY}:custom`;
    }
  } catch {
    // URLのパースに失敗した場合
  }
  return null;
};

// ホスト用のカスタム設定を読み込み
export const loadCustomSettings = async (
  url: string | undefined,
): Promise<CategorySettings | null> => {
  const key = getCustomSettingsKey(url);
  if (!key) return null;

  const [settings, found] = await getAsync(key, {});
  return found ? (settings as CategorySettings) : null;
};

// ホスト用のカスタム設定を保存
export const saveCustomSettings = async (
  url: string | undefined,
  settings: CategorySettings,
): Promise<void> => {
  const key = getCustomSettingsKey(url);
  if (key) {
    await setAsync(key, settings);
  }
};

// カスタム設定の初期値を取得（オプション画面 → 基本プリセットの順で検索）
export const getInitialCustomSettings = async (): Promise<CategorySettings> => {
  const [defaultSettings] = await loadDefaultSettings();

  // オプション画面がカスタムモードの場合、その設定を使用
  if (defaultSettings.elementTypeMode.mode === "custom") {
    return defaultSettings.elementTypeMode.settings;
  }

  // それ以外の場合は基本プリセットを使用
  const basicPreset = presets.find((p) => p.id === "basic");
  return basicPreset ? basicPreset.settings : defaultCustomCategorySettings;
};
