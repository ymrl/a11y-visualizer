import React from "react";
import ReactDOM from "react-dom/client";
import { Root } from "./Root";
import { Settings, SettingsMessage, loadHostSettings } from "../settings";
import { SettingsProvider } from "./components/SettingsProvider";
import { loadEnabled } from "../enabled";

export const injectRoot = async (w: Window, parent: Element) => {
  if (!location.href.startsWith("http")) {
    return;
  }
  const [settings] = await loadHostSettings(location.host);
  const enabled = await loadEnabled();

  const rootDiv = w.document.createElement("div");
  parent.append(rootDiv);

  const root = ReactDOM.createRoot(rootDiv);

  const render = (settings: Settings, parent: Element, enabled: boolean) =>
    root.render(
      <React.StrictMode>
        <SettingsProvider settings={settings}>
          <Root parent={parent} enabled={enabled} />
        </SettingsProvider>
      </React.StrictMode>,
    );

  render(settings, parent, enabled);

  window.addEventListener("visibilitychange", async () => {
    if (document.visibilityState === "visible") {
      const [settings] = await loadHostSettings(location.host);
      const enabled = await loadEnabled();
      render(settings, parent, enabled);
    }
  });

  const listener = (message: SettingsMessage) => {
    switch (message.type) {
      case "updateHostSettings":
        if (message.host === location.host) {
          render(message.settings, parent, message.enabled);
        }
        break;
      case "applySettings":
        render(message.settings, parent, message.enabled);
        break;
      case "updateEnabled":
        render(settings, parent, message.enabled);
        break;
    }
  };
  chrome.runtime.onMessage.addListener(listener);
  window.addEventListener("unload", () => {
    chrome.runtime.onMessage.removeListener(listener);
  });
};
