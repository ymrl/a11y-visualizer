import React from "react";
import "./index.css";
import { Settings } from "../types";
import { useLang } from "../useLang";
import { initialSettings } from "../initialSettings";
import { getAsync } from "../chrome/localStorage";
import { sendMessageToActiveTab } from "../chrome/tabs";
import { SettingsEditor } from "../components/SettingsEditor";

export const Popup = () => {
  const [settings, setSettings] = React.useState<Settings>(initialSettings);
  const [hostSetting, setHostSetting] = React.useState<boolean>(false);
  const { t, lang } = useLang();

  const getSettings = async (applyToTab: boolean = false) => {
    const [baseSettings] = await getAsync("settings", initialSettings);
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    let currentSettings = baseSettings;
    let hostFound = false;
    if (tabs[0] && tabs[0].url && tabs[0].url.startsWith("http")) {
      const url = new URL(tabs[0].url);
      const host = url.host;
      [currentSettings, hostFound] = await getAsync(host, baseSettings);
    }
    setHostSetting(hostFound);
    setSettings(currentSettings);
    applyToTab &&
      sendMessageToActiveTab({
        type: "updateAccessibilityInfo",
        settings: currentSettings,
      });
  };
  React.useEffect(() => {
    getSettings();
  }, []);

  const updateSettings = async (newSettings: Settings) => {
    setSettings(newSettings);
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0] && tabs[0].url && tabs[0].url.startsWith("http")) {
      const url = new URL(tabs[0].url);
      const host = url.host;
      setHostSetting(true);
      chrome.storage.local.set({ [host]: newSettings });
    }
    sendMessageToActiveTab({
      type: "updateAccessibilityInfo",
      settings: newSettings,
    });
  };

  return (
    <div className="w-64 p-2 flex flex-col gap-2 items-start" lang={lang}>
      <SettingsEditor settings={settings} onChange={updateSettings} />
      <div className="w-full flex flex-row gap-2 items-center">
        <button
          type="button"
          className="
            border-slate-400 border-solid border
            px-4 py-1 rounded-full
            bg-slate-100 hover:enabled:bg-slate-200 transition-colors
            disabled:border-slate-200 disabled:text-slate-600 disabled:cursor-not-allowed"
          onClick={() => {
            sendMessageToActiveTab({
              type: "updateAccessibilityInfo",
              settings: settings,
            });
          }}
        >
          {t("popup.rerun")}
        </button>

        <button
          type="button"
          className="
            border-slate-400 border-solid border
            px-4 py-1 rounded-full
            bg-slate-100 hover:enabled:bg-slate-200 transition-colors
            disabled:border-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed"
          onClick={async () => {
            const tabs = await chrome.tabs.query({
              active: true,
              currentWindow: true,
            });
            if (tabs[0] && tabs[0].url && tabs[0].url.startsWith("http")) {
              const url = new URL(tabs[0].url);
              const host = url.host;
              await chrome.storage.local.remove(host);
              getSettings(true);
            }
          }}
          disabled={!hostSetting}
        >
          {t("popup.reset")}
        </button>
      </div>
      <p className="text-xs text-slate-500">{t("popup.hostDesc")}</p>
    </div>
  );
};
