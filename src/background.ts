import { ENABLED_KEY, loadEnabled, saveEnabled } from "./enabled";
import disabled192 from "./assets/icon-disabled.png";
import disabled48 from "./assets/icon-disabled@48w.png";
import disabled128 from "./assets/icon-disabled@128w.png";
import disabled16 from "./assets/icon-disabled@16w.png";
import enabled192 from "./assets/icon.png";
import enabled128 from "./assets/icon@128w.png";
import enabled48 from "./assets/icon@48w.png";
import enabled16 from "./assets/icon@16w.png";

const enabledIcons = {
  16: enabled16,
  48: enabled48,
  128: enabled128,
  192: enabled192,
} as const;

const disabledIcons = {
  16: disabled16,
  48: disabled48,
  128: disabled128,
  192: disabled192,
} as const;

const updateIcons = (enabled: boolean) => {
  if (enabled) {
    chrome.action.setIcon({
      path: enabledIcons,
    });
  } else {
    chrome.action.setIcon({
      path: disabledIcons,
    });
  }
};

chrome.runtime.onInstalled.addListener(async (details) => {
  const { reason } = details;
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    saveEnabled(true);
  } else if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
    const enabled = await chrome.storage.local.get(ENABLED_KEY);
    if (enabled[ENABLED_KEY] === undefined) {
      saveEnabled(true);
    }
  }
  const enabled = await loadEnabled();
  updateIcons(enabled);
});

chrome.runtime.onStartup.addListener(async () => {
  const enabled = await loadEnabled();
  updateIcons(enabled);
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "updateEnabled") {
    updateIcons(message.enabled);
  }
  if (message.type === "isEnabled") {
    (async () => {
      const enabled = await loadEnabled();
      sendResponse({
        type: "isEnabledAnswer",
        enabled,
      });
    })();
    return true;
  }
});
