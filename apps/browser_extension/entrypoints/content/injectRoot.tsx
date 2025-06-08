import { browser } from "#imports";
import React from "react";
import ReactDOM from "react-dom/client";
import { Root, RootOptions } from "./Root";
import { Settings, SettingsMessage, loadUrlSettings } from "../../src/settings";
import { SettingsProvider } from "./components/SettingsProvider";
import { loadEnabled } from "../../src/enabled";

type InjectOptions = RootOptions & {
  mountOnce?: boolean;
};

const mount = (w: Window, parent: Element, options?: RootOptions) => {
  const rootElement = w.document.createElement("div");
  rootElement.style.display = "block";
  rootElement.style.position = "static";
  rootElement.style.margin = "0";
  rootElement.style.padding = "0";
  parent.append(rootElement);
  const root = ReactDOM.createRoot(rootElement);
  const parentRef = { current: parent };
  const render = (settings: Settings) => {
    root.render(
      <React.StrictMode>
        <SettingsProvider settings={settings}>
          <Root parentRef={parentRef} options={options} />
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
  mountReturn?.render(settings);

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
        (mountReturn || (mountReturn = mount(w, parent))).render(settings);
      }
    } else {
      mountReturn?.unmount();
      mountReturn = null;
      if (mountOnce) {
        browser.runtime.onMessage.removeListener(listener);
      }
    }
  };
  browser.runtime.onMessage.addListener(listener);

  w.document.addEventListener("visibilitychange", async () => {
    if (w.document.visibilityState === "visible") {
      const { enabled } = await browser.runtime.sendMessage({
        type: "isEnabled",
      });
      if (enabled) {
        (mountReturn || (mountReturn = mount(w, parent))).render(settings);
      } else {
        mountReturn?.unmount();
        mountReturn = null;
      }
    }
  });
};
