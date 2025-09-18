import { browser, defineBackground } from "#imports";
export default defineBackground({
  persistent: false,
  main: () => {
    const ENABLED_KEY = "__enabled__";

    const enabledIcons = {
      "16": "icon/16.png",
      "32": "icon/32.png",
      "48": "icon/48.png",
      "96": "icon/96.png",
      "128": "icon/128.png",
    } as const;

    const disabledIcons = {
      "16": "icon/disabled-16.png",
      "32": "icon/disabled-32.png",
      "48": "icon/disabled-48.png",
      "96": "icon/disabled-96.png",
      "128": "icon/disabled-128.png",
    } as const;

    const loadEnabled = async (): Promise<boolean> => {
      const result = await browser.storage.local.get(ENABLED_KEY);
      return result[ENABLED_KEY] ?? false;
    };

    const saveEnabled = async (enabled: boolean): Promise<void> => {
      await browser.storage.local.set({ [ENABLED_KEY]: enabled });
    };

    const updateIcons = async (enabled: boolean) => {
      try {
        const iconAPI = browser.action || browser.browserAction;
        if (enabled) {
          await iconAPI.setIcon({
            path: enabledIcons,
          });
        } else {
          await iconAPI.setIcon({
            path: disabledIcons,
          });
        }
      } catch (error) {
        console.error("Failed to update icon:", error);
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
      await updateIcons(enabled);
    });

    browser.runtime.onStartup.addListener(async () => {
      const enabled = await loadEnabled();
      await updateIcons(enabled);
    });

    browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.type === "updateEnabled") {
        updateIcons(message.enabled).catch(console.error);
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
  },
});
