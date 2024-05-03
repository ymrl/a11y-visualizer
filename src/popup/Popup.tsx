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
  const { t, lang } = useLang();

  React.useEffect(() => {
    const getSettings = async () => {
      const newSettings = await getAsync("settings", initialSettings);
      setSettings(newSettings);
    };
    getSettings();
  }, []);

  const updateSettings = async (newSettings: Settings) => {
    setSettings(newSettings);
    chrome.storage.local.set({ settings: newSettings });
    sendMessageToActiveTab({
      type: "updateAccessibilityInfo",
      settings: newSettings,
    });
  };

  return (
    <>
      <div className="w-64 p-2 flex flex-col gap-2 items-start" lang={lang}>
        <SettingsEditor settings={settings} onChange={updateSettings} />
        <button
          type="button"
          className="
          border-slate-400 border-solid border
          px-4 py-1 rounded-full
          bg-slate-100 hover:bg-slate-200 transition-colors"
          onClick={() => {
            sendMessageToActiveTab({
              type: "updateAccessibilityInfo",
              settings: settings,
            });
          }}
        >
          {t("popup.rerun")}
        </button>
      </div>
    </>
  );
};
