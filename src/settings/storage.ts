import { Settings } from "./types";
import { DEFAULT_SETTING_KEY, initialSettings } from "./constatns";
import { getAsync, setAsync } from "../chrome/localStorage";

export const loadDefaultSettings = async (): Promise<[Settings, boolean]> => {
  return await getAsync(DEFAULT_SETTING_KEY, initialSettings);
};

export const loadHostSettings = async (
  url: string | undefined,
): Promise<[Settings, boolean]> => {
  const [baseSettings] = await loadDefaultSettings();
  if (url && url.startsWith("http")) {
    const parsedURL = new URL(url);
    const host = parsedURL.host;
    return await getAsync(host, baseSettings);
  }
  return [baseSettings, false];
};

export const saveDefaultSettings = async (settings: Settings) => {
  return await setAsync(DEFAULT_SETTING_KEY, settings);
};

export const saveHostSettings = async (
  url: string | undefined,
  settings: Settings,
) => {
  if (url && url.startsWith("http")) {
    const parsedURL = new URL(url);
    const host = parsedURL.host;
    return await setAsync(host, settings);
  }
  return false;
};
