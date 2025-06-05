import { loadEnabled } from "../../src/enabled";
import { injectRoot } from "./injectRoot";
import { SettingsMessage } from "../../src/settings";

const initContentScript = async () => {
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

  chrome.runtime.onMessage.addListener(listener);

  document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState === "visible") {
      const { enabled } = await chrome.runtime.sendMessage({
        type: "isEnabled",
      });
      if (enabled && !injected) {
        injectRoot(window, window.document.body, { mountOnce: false });
        injected = true;
      }
    }
  });
};

initContentScript();
