import { defineContentScript, browser } from "#imports";
import type { SettingsMessage } from "../../src/settings";
export default defineContentScript({
  matches: ["<all_urls>"],
  main: async () => {
    const { loadEnabled } = await import("../../src/enabled");
    const { injectRoot } = await import("./injectRoot");

    let injected = false;
    const enabled = await loadEnabled();
    if (enabled) {
      injectRoot(window, window.document.body, { mountOnce: false });
      injected = true;
    }

    const listener = (message: SettingsMessage) => {
      if (message.type !== "updateEnabled") return;
      if (message.enabled && !injected) {
        injectRoot(window, window.document.body, { mountOnce: false });
        injected = true;
      }
    };

    browser.runtime.onMessage.addListener(listener);

    document.addEventListener("visibilitychange", async () => {
      if (document.visibilityState === "visible") {
        const { enabled } = await browser.runtime.sendMessage({
          type: "isEnabled",
        });
        if (enabled && !injected) {
          injectRoot(window, window.document.body, { mountOnce: false });
          injected = true;
        }
      }
    });
  },
});
