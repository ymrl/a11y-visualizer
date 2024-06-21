import { Settings } from "./types";
import {
  DEFAULT_SETTING_KEY,
  FILE_SETTING_KEY,
  initialSettings,
} from "./constatns";
import { getAsync, removeAsync, setAsync } from "../chrome/localStorage";

export const loadDefaultSettings = async (): Promise<[Settings, boolean]> => {
  return await getAsync(DEFAULT_SETTING_KEY, initialSettings);
};

export const loadUrlSettings = async (
  url: string | undefined,
): Promise<[Settings, boolean]> => {
  const [baseSettings] = await loadDefaultSettings();
  if (url) {
    const parsedURL = new URL(url);
    if (["http:", "https:"].includes(parsedURL.protocol) && parsedURL.host) {
      return await getAsync(parsedURL.host, baseSettings);
    }
    if (parsedURL.protocol === "file:") {
      return await getAsync(FILE_SETTING_KEY, baseSettings);
    }
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
