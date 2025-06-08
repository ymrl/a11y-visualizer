import { defineBackground, browser } from "#imports";
export default defineBackground(() => {
  const ENABLED_KEY = "enabled";

  const enabledIcons = {
    16: "/icon/16.png",
    48: "/icon/48.png",
    128: "/icon/128.png",
    192: "/icon/96.png",
  } as const;

  const disabledIcons = {
    16: "/icon/disabled-16.png",
    48: "/icon/disabled-48.png",
    128: "/icon/disabled-128.png",
    192: "/icon/disabled-96.png",
  } as const;

  const loadEnabled = async (): Promise<boolean> => {
    const result = await browser.storage.local.get(ENABLED_KEY);
    return result[ENABLED_KEY] ?? false;
  };

  const saveEnabled = async (enabled: boolean): Promise<void> => {
    await browser.storage.local.set({ [ENABLED_KEY]: enabled });
  };

  const updateIcons = (enabled: boolean) => {
    if (enabled) {
      browser.action.setIcon({
        path: enabledIcons,
      });
    } else {
      browser.action.setIcon({
        path: disabledIcons,
      });
    }
  };

  browser.runtime.onInstalled.addListener(async (details) => {
    const { reason } = details;
    if (reason === browser.runtime.OnInstalledReason.INSTALL) {
      saveEnabled(true);
    } else if (details.reason === browser.runtime.OnInstalledReason.UPDATE) {
      const enabled = await browser.storage.local.get(ENABLED_KEY);
      if (enabled[ENABLED_KEY] === undefined) {
        saveEnabled(true);
      }
    }
    const enabled = await loadEnabled();
    updateIcons(enabled);
  });

  browser.runtime.onStartup.addListener(async () => {
    const enabled = await loadEnabled();
    updateIcons(enabled);
  });

  browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
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
});
