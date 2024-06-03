import { loadEnabled } from "../enabled";
import { injectRoot } from "./injectRoot";
import { SettingsMessage } from "../settings";

let injected = false;
const enabled = await loadEnabled();
if (enabled) {
  injectRoot(window, window.document.body);
  injected = true;
}

const listener = (message: SettingsMessage) => {
  if (message.type !== "updateEnabled") return;
  if (message.enabled && !injected) {
    injectRoot(window, window.document.body);
    injected = true;
  } else {
    injected = false;
  }
};
chrome.runtime.onMessage.addListener(listener);
