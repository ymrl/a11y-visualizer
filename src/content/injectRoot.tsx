import React from "react";
import ReactDOM from "react-dom/client";
import { Root } from "./Root";
import { Settings, Message } from "../types";
import { SettingsProvider } from "./components/SettingsProvider";
import { initialSettings } from "../initialSettings";
import { getAsync } from "../chrome/localStorage";

let counter = 0;

export const injectRoot = async (w: Window, parent: Element) => {
  if (!location.href.startsWith("http")) {
    return;
  }
  const host = location.host;
  const baseSettings = await getAsync("settings", initialSettings);
  const hostSettings = await getAsync(host, baseSettings);

  const rootDiv = w.document.createElement("div");
  parent.append(rootDiv);
  rootDiv.setAttribute("role", "region");
  rootDiv.setAttribute("aria-label", `Accessibility Visualizer ${counter++}`);

  const root = ReactDOM.createRoot(rootDiv);

  const render = (settings: Settings, parent: Element) =>
    root.render(
      <React.StrictMode>
        <SettingsProvider settings={settings}>
          <Root parent={parent} />
        </SettingsProvider>
      </React.StrictMode>,
    );

  render(hostSettings, parent);

  const listener = (message: Message) => {
    if (message.type === "updateAccessibilityInfo") {
      const newSettings = {
        ...initialSettings,
        ...message.settings,
      };
      render(newSettings, parent);
    }
  };
  chrome.runtime.onMessage.addListener(listener);
};
