import React from "react";
import { getAsync } from "../chrome/localStorage";
import { initialSettings } from "../initialSettings";
import { Settings } from "../types";
import { sendMessageToActiveTab } from "../chrome/tabs";
import { SettingsEditor } from "../components/SettingsEditor";

export const OptionsPage = () => {
  const [settings, setSettings] = React.useState<Settings>(initialSettings);

  React.useEffect(() => {
    const getSettings = async () => {
      const [newSettings] = await getAsync("settings", initialSettings);
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
    <div className="font-sans px-5 pt-0 pb-5">
      <SettingsEditor settings={settings} onChange={updateSettings} />
    </div>
  );
};
