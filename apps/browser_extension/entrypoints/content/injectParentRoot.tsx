import React from "react";
import ReactDOM from "react-dom/client";
import { browser } from "#imports";
import { loadEnabled } from "../../src/enabled";
import {
  loadUrlSettings,
  type Settings,
  type SettingsMessage,
} from "../../src/settings";
import { SettingsProvider } from "./components/SettingsProvider";
import { ParentRoot } from "./ParentRoot";

const mount = (w: Window, parent: Element) => {
  const rootElement = w.document.createElement("div");
  rootElement.style.display = "block";
  rootElement.style.position = "static";
  rootElement.style.margin = "0";
  rootElement.style.padding = "0";
  rootElement.setAttribute("data-a11y-visualizer-extension-parent", "");
  parent.append(rootElement);
  const root = ReactDOM.createRoot(rootElement);
  const render = (settings: Settings) => {
    root.render(
      <React.StrictMode>
        <SettingsProvider settings={settings}>
          <ParentRoot />
        </SettingsProvider>
      </React.StrictMode>,
    );
  };
  const unmount = () => {
    parent.removeChild(rootElement);
    root.unmount();
  };
  return { render, unmount };
};

export const injectParentRoot = async (w: Window, parent: Element) => {
  if (!w.location.href.match(/^(?:https?)|(?:file):\/\//)) {
    return;
  }
  let [settings] = await loadUrlSettings(location.href);
  const enabled = await loadEnabled();

  let mountReturn = enabled ? mount(w, parent) : null;
  if (mountReturn) mountReturn.render(settings);

  const listener = (message: SettingsMessage) => {
    if (
      !["updateUrlSettings", "applySettings", "updateEnabled"].includes(
        message.type,
      )
    )
      return;
    if (message.type === "applySettings") {
      settings = message.settings;
    }
    if (message.type === "updateUrlSettings") {
      const parsedUrl = new URL(message.url);
      if (parsedUrl.host === location.host) {
        settings = message.settings;
      } else if (
        parsedUrl.protocol === "file:" &&
        location.protocol === "file:"
      ) {
        settings = message.settings;
      }
    }
    if (message.enabled) {
      mountReturn = mountReturn || mount(w, parent);
      mountReturn.render(settings);
    } else {
      mountReturn?.unmount();
      mountReturn = null;
    }
  };
  browser.runtime.onMessage.addListener(listener);

  w.document.addEventListener("visibilitychange", async () => {
    if (w.document.visibilityState === "visible") {
      const { enabled } = await browser.runtime.sendMessage({
        type: "isEnabled",
      });
      if (enabled) {
        mountReturn = mountReturn || mount(w, parent);
        mountReturn.render(settings);
      } else {
        mountReturn?.unmount();
        mountReturn = null;
      }
    }
  });
};
