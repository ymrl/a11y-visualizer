import React from "react";
import "../popup/index.css";
import {
  Settings,
  initialSettings,
  loadDefaultSettings,
  resetDefaultSettings,
  saveDefaultSettings,
} from "../../src/settings";
import type { SupportedLanguage } from "../../src/settings/types";
import { SettingsEditor } from "../../src/components/SettingsEditor";
import { useLang } from "../../src/useLang";

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

  const { t, lang, updateLanguage } = useLang();

  const handleLanguageChange = async (newLang: SupportedLanguage) => {
    const newSettings = { ...settings, language: newLang };
    await updateSettings(newSettings);
    updateLanguage(newLang);
  };

  return (
    <div
      className="font-sans text-zinc-800 bg-zinc-50
      dark:bg-zinc-900 dark:text-zinc-300
      flex flex-row justify-center
      "
      lang={lang}
    >
      <div className="px-5 pt-5 pb-5 flex flex-col gap-5 max-w-lg">
        <label className="flex flex-row items-center justify-end gap-2 px-2">
          <span className="text-sm text-zinc-800 dark:text-zinc-300">
            {t("optionsPage.displayLanguage")}
          </span>
          <select
            className="border-zinc-400 border-solid border rounded-md
              py-1 px-2 text-sm w-32
              bg-white dark:bg-zinc-800
              text-zinc-800 dark:text-zinc-300"
            value={settings.language}
            onChange={(e) =>
              handleLanguageChange(e.target.value as SupportedLanguage)
            }
          >
            <option value="auto">{t("languages.auto")}</option>
            <option value="en">{t("languages.en")}</option>
            <option value="ja">{t("languages.ja")}</option>
            <option value="ko">{t("languages.ko")}</option>
          </select>
        </label>

        <SettingsEditor
          settings={settings}
          onChange={updateSettings}
          showDisplaySettingsCollapsed={false}
          useTabsForElementTypes={false}
        />
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
              className="text-sm text-gray-500 px-2"
              aria-live="polite"
              aria-atomic="true"
            >
              {resetDone && t("optionsPage.resetSettingsSuccess")}
            </p>
          </div>
        </details>
      </div>
    </div>
  );
};
