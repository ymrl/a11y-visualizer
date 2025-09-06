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
import { Root, type RootOptions } from "./Root";

type InjectOptions = RootOptions & {
  mountOnce?: boolean;
  mountType?: "initial" | "enabled";
};

const mount = (w: Window, parent: Element, options?: RootOptions) => {
  const rootElement = w.document.createElement("div");
  rootElement.style.display = "block";
  rootElement.style.position = "static";
  rootElement.style.margin = "0";
  rootElement.style.padding = "0";
  rootElement.setAttribute("data-a11y-visualizer-extension", "");
  parent.append(rootElement);
  const root = ReactDOM.createRoot(rootElement);
  const parentRef = { current: parent };
  const render = (
    settings: Settings,
    renderType?: "initial" | "enabled" | "visibilitychange",
  ) => {
    root.render(
      <React.StrictMode>
        <SettingsProvider settings={settings}>
          <Root parentRef={parentRef} options={{ ...options, renderType }} />
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

export const injectRoot = async (
  w: Window,
  parent: Element,
  { mountOnce, ...options }: InjectOptions,
) => {
  if (!w.location.href.match(/^(?:https?)|(?:file):\/\//)) {
    return;
  }
  let [settings] = await loadUrlSettings(location.href);
  const enabled = await loadEnabled();

  let mountReturn = enabled ? mount(w, parent, options) : null;
  mountReturn?.render(settings, "initial");

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
      if (!mountOnce) {
        mountReturn = mountReturn || mount(w, parent);
        mountReturn.render(settings, "enabled");
      }
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
        mountReturn.render(settings, "visibilitychange");
      } else {
        mountReturn?.unmount();
        mountReturn = null;
      }
    }
  });
};
