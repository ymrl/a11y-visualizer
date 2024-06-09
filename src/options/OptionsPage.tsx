import React from "react";
import {
  Settings,
  initialSettings,
  loadDefaultSettings,
  resetDefaultSettings,
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
  const resetRef = React.useRef<HTMLDetailsElement>(null);
  const [resetDone, setResetDone] = React.useState(false);

  React.useEffect(() => {
    getSettings();
  }, []);

  const updateSettings = async (newSettings: Settings) => {
    setSettings(newSettings);
    saveDefaultSettings(newSettings);
  };

  const { t, lang } = useLang();

  return (
    <div
      className="font-sans text-zinc-800 bg-zinc-50
      dark:bg-zinc-900 dark:text-zinc-300
      px-5 pt-5 pb-5 flex flex-col gap-5"
      lang={lang}
    >
      <SettingsEditor settings={settings} onChange={updateSettings} />
      <p className="text-sm text-gray-500">{t("optionsPage.description")}</p>
      <details ref={resetRef}>
        <summary
          className="text-sm link text-teal-700 underline hover:enabled:text-teal-900 transition-colors dark:text-teal-400 hover:enabled:dark:text-teal-200 cursor-pointer"
          onClick={() => {
            setResetDone(false);
          }}
        >
          {t("optionsPage.resetSettings")}
        </summary>
        <div className="flex flex-col gap-2 pl-3 pt-2">
          <p className="text-sm text-gray-500">
            {t("optionsPage.resetSettingsConfirm")}
          </p>
          <div className="text-sm flex flex-row gap-2 flex-wrap">
            <button
              className="link text-teal-700 underline hover:enabled:text-teal-900 transition-colors dark:text-teal-400 hover:enabled:dark:text-teal-200"
              onClick={async () => {
                await resetDefaultSettings();
                setSettings(initialSettings);
                setResetDone(true);
              }}
            >
              {t("optionsPage.resetSettingsConfirmYes")}
            </button>
            <button
              className="link text-teal-700 underline hover:enabled:text-teal-900 transition-colors dark:text-teal-400 hover:enabled:dark:text-teal-200"
              onClick={() => {
                if (resetRef.current) {
                  resetRef.current.open = false;
                }
              }}
            >
              {t("optionsPage.resetSettingsConfirmNo")}
            </button>
          </div>
          <p
            className="text-sm text-gray-500"
            aria-live="polite"
            aria-atomic="true"
          >
            {resetDone && t("optionsPage.resetSettingsSuccess")}
          </p>
        </div>
      </details>
    </div>
  );
};
