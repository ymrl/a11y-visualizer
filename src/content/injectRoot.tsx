import React from "react";
import ReactDOM from "react-dom/client";
import { Root } from "./Root";
import {
  Settings,
  Message,
  initialSettings,
  loadHostSettings,
} from "../settings";
import { SettingsProvider } from "./components/SettingsProvider";
import { loadEnabled } from "../enabled";

let counter = 0;

export const injectRoot = async (w: Window, parent: Element) => {
  if (!location.href.startsWith("http")) {
    return;
  }
  const [settings] = await loadHostSettings(location.href);
  const enabled = await loadEnabled();

  const rootDiv = w.document.createElement("div");
  parent.append(rootDiv);
  rootDiv.setAttribute("role", "region");
  rootDiv.setAttribute("aria-label", `Accessibility Visualizer ${counter++}`);

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

  const listener = (message: Message) => {
    if (message.type === "updateAccessibilityInfo") {
      const newSettings = {
        ...initialSettings,
        ...message.settings,
      };
      render(newSettings, parent, message.enabled);
    }
  };
  chrome.runtime.onMessage.addListener(listener);
};
