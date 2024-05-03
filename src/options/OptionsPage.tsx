import React from "react";
import { getAsync } from "../chrome/localStorage";
import { initialSettings } from "../initialSettings";
import { Settings } from "../types";
import { sendMessageToActiveTab } from "../chrome/tabs";
import { SettingsEditor } from "../components/SettingsEditor";
import { useLang } from "../useLang";

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

  const { t, lang } = useLang();

  return (
    <div className="font-sans px-5 pt-0 pb-5 flex flex-col gap-5" lang={lang}>
      <SettingsEditor settings={settings} onChange={updateSettings} />
      <p className="text-sm text-gray-500">{t("optionsPage.description")}</p>
    </div>
  );
};
