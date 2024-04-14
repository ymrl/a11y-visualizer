import React from "react";
import ReactDOM from "react-dom/client";
import { Root } from "./Root";
import { Settings, Message } from "../types";
import { SettingsProvider } from "./components/SettingsProvider";

export const injectRoot = (w: Window, parent: Element) => {
  const rootDiv = w.document.createElement("div");
  parent.append(rootDiv);

  const initialSettings = {
    accessibilityInfo: false,
    image: true,
    formControl: true,
    link: true,
    heading: true,
    ariaHidden: true,
  };
  const root = ReactDOM.createRoot(rootDiv);

  const render = (settings: Settings, parent: Element) =>
    root.render(
      <React.StrictMode>
        <SettingsProvider settings={settings}>
          <Root parent={parent} />
        </SettingsProvider>
      </React.StrictMode>,
    );

  chrome.storage.local.get("settings", (data) => {
    const newSettings = {
      ...initialSettings,
      ...data.settings,
    };
    render(newSettings, parent);
  });

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

  render(initialSettings, parent);
};
