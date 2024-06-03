import React from "react";
import ReactDOM from "react-dom/client";
import { Root } from "./Root";
import { Settings, SettingsMessage, loadHostSettings } from "../settings";
import { SettingsProvider } from "./components/SettingsProvider";
import { loadEnabled } from "../enabled";

const mount = (w: Window, parent: Element) => {
  const rootElement = w.document.createElement("div");
  parent.append(rootElement);
  const root = ReactDOM.createRoot(rootElement);
  const render = (settings: Settings) => {
    root.render(
      <React.StrictMode>
        <SettingsProvider settings={settings}>
          <Root parent={parent} />
        </SettingsProvider>
      </React.StrictMode>,
    );
  };
  const unmount = () => {
    parent.removeChild(rootElement);
    root.unmount();
  };
  return {
    render,
    unmount,
  };
};

export const injectRoot = async (w: Window, parent: Element) => {
  if (!w.location.href.startsWith("http")) {
    return;
  }
  let [settings] = await loadHostSettings(w.location.host);
  const enabled = await loadEnabled();

  let mountReturn = enabled ? mount(w, parent) : null;
  mountReturn?.render(settings);

  const listener = (message: SettingsMessage) => {
    if (
      !["updateHostSettings", "applySettings", "updateEnabled"].includes(
        message.type,
      )
    )
      return;
    if (
      message.type === "applySettings" ||
      message.type === "updateHostSettings"
    ) {
      settings = message.settings;
    }
    if (message.enabled) {
      (mountReturn || (mountReturn = mount(w, parent))).render(settings);
    } else {
      mountReturn?.unmount();
      mountReturn = null;
      chrome.runtime.onMessage.removeListener(listener);
    }
  };
  chrome.runtime.onMessage.addListener(listener);
};
