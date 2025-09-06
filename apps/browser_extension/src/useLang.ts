import React from "react";
import { useTranslation } from "react-i18next";
import { browser } from "#imports";
import i18n from "./i18n";
import { loadDefaultSettings } from "./settings";
import type { Settings, SupportedLanguage } from "./settings/types";

const getLanguageFromBrowser = (): SupportedLanguage => {
  const browserLang = browser.i18n.getUILanguage();
  if (browserLang.match(/^ja/)) return "ja";
  if (browserLang.match(/^ko/)) return "ko";
  return "en";
};

const resolveLanguage = (settingLang: SupportedLanguage): SupportedLanguage => {
  if (settingLang === "auto") {
    return getLanguageFromBrowser();
  }
  return settingLang;
};

export const useLang = () => {
  const [lang, setLang] = React.useState<string>("en");

  React.useEffect(() => {
    loadDefaultSettings().then(([settings]) => {
      const resolvedLang = resolveLanguage(settings.language);
      setLang(resolvedLang);
      i18n.changeLanguage(resolvedLang);
    });

    // ストレージ変更の監視
    const handleStorageChange = (
      changes: Record<string, { newValue?: unknown; oldValue?: unknown }>,
    ) => {
      if (changes.__default__?.newValue) {
        const newSettings = changes.__default__.newValue as Settings;
        if (newSettings.language) {
          const resolvedLang = resolveLanguage(newSettings.language);
          setLang(resolvedLang);
          i18n.changeLanguage(resolvedLang);
        }
      }
    };

    browser.storage.local.onChanged.addListener(handleStorageChange);

    return () => {
      browser.storage.local.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  const { t } = useTranslation();

  return {
    t,
    lang,
    updateLanguage: (newLang: SupportedLanguage) => {
      const resolvedLang = resolveLanguage(newLang);
      setLang(resolvedLang);
      i18n.changeLanguage(resolvedLang);
    },
  };
};
