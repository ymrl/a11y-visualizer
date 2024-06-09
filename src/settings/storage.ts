import { Settings } from "./types";
import { DEFAULT_SETTING_KEY, initialSettings } from "./constatns";
import { getAsync, removeAsync, setAsync } from "../chrome/localStorage";

export const loadDefaultSettings = async (): Promise<[Settings, boolean]> => {
  return await getAsync(DEFAULT_SETTING_KEY, initialSettings);
};

export const loadHostSettings = async (
  host: string | undefined,
): Promise<[Settings, boolean]> => {
  const [baseSettings] = await loadDefaultSettings();
  if (host) {
    return await getAsync(host, baseSettings);
  }
  return [baseSettings, false];
};

export const saveDefaultSettings = async (settings: Settings) => {
  return await setAsync(DEFAULT_SETTING_KEY, settings);
};

export const saveHostSettings = async (host: string, settings: Settings) => {
  setAsync(host, settings);
};

export const resetHostSettings = async (host: string) => {
  removeAsync(host);
};

export const resetDefaultSettings = async () => {
  await removeAsync(DEFAULT_SETTING_KEY);
};
