import React from "react";
import {
  Settings,
  initialSettings,
  loadDefaultSettings,
  saveDefaultSettings,
} from "../settings";
import { SettingsEditor } from "../components/SettingsEditor";
import { useLang } from "../useLang";

export const OptionsPage = () => {
  const [settings, setSettings] = React.useState<Settings>(initialSettings);
  const getSettings = async () => {
    const [newSettings] = await loadDefaultSettings();
    setSettings(newSettings);
  };

  React.useEffect(() => {
    getSettings();
  }, []);

  const updateSettings = async (newSettings: Settings) => {
    setSettings(newSettings);
    saveDefaultSettings(newSettings);
  };

  const { t, lang } = useLang();

  return (
    <div className="font-sans px-5 pt-0 pb-5 flex flex-col gap-5" lang={lang}>
      <SettingsEditor settings={settings} onChange={updateSettings} />
      <p className="text-sm text-gray-500">{t("optionsPage.description")}</p>
    </div>
  );
};
