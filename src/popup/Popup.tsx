import React from "react";
import "./index.css";
import {
  Settings,
  initialSettings,
  loadHostSettings,
  saveHostSettings,
} from "../settings";
import { useLang } from "../useLang";
import { sendMessageToActiveTab } from "../chrome/tabs";
import { SettingsEditor } from "../components/SettingsEditor";

export const Popup = () => {
  const [settings, setSettings] = React.useState<Settings>(initialSettings);
  const [hostSetting, setHostSetting] = React.useState<boolean>(false);
  const { t, lang } = useLang();

  const loadSettings = async (applyToTab: boolean = false) => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const [newSettings, found] = await loadHostSettings(tabs[0]?.url);
    setHostSetting(found);
    setSettings(newSettings);
    applyToTab &&
      sendMessageToActiveTab({
        type: "updateAccessibilityInfo",
        settings: newSettings,
      });
  };

  React.useEffect(() => {
    loadSettings();
  }, []);

  const updateSettings = async (newSettings: Settings) => {
    setSettings(newSettings);
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    saveHostSettings(tabs[0]?.url, newSettings);
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
              loadSettings(true);
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
