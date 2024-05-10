import { ENABLED_KEY } from "./enabled";
import {
  OBSOLETE_SETTING_KEY,
  DEFAULT_SETTING_KEY,
  initialSettings,
} from "./settings";

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason !== "update") {
    return;
  }
  const data = await chrome.storage.local.get(OBSOLETE_SETTING_KEY);
  const oldSetting = data[OBSOLETE_SETTING_KEY];
  if (oldSetting) {
    const settings = {
      ...initialSettings,
      ...oldSetting,
    };
    await chrome.storage.local.set({ [DEFAULT_SETTING_KEY]: settings });
    await chrome.storage.local.remove(OBSOLETE_SETTING_KEY);
  }
  const enabled = await chrome.storage.local.get(ENABLED_KEY);
  if (enabled[ENABLED_KEY] === undefined) {
    await chrome.storage.local.set({ __enabled__: true });
  }
});
