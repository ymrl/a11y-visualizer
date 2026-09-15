import React from "react";
import { useTranslation } from "react-i18next";
import { browser } from "#imports";
import i18n from "./i18n";
import { loadDefaultSettings } from "./settings";
import type { Settings, SupportedLanguage } from "./settings/types";
import { createExternalStore } from "./utils/createExternalStore";

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

// 言語の状態はモジュールスコープで一元管理する。useLangはチップごとなど
// 多数のコンポーネントから呼ばれるため、フックのマウントごとにストレージの
// 読み込みやリスナー登録を行うと重い
const langStore = createExternalStore<string>("en");
let langInitialized = false;

const applyLanguage = (settingLang: SupportedLanguage) => {
  const resolvedLang = resolveLanguage(settingLang);
  langStore.set(resolvedLang);
  i18n.changeLanguage(resolvedLang);
};

const initializeLang = () => {
  if (langInitialized) return;
  langInitialized = true;

  loadDefaultSettings().then(([settings]) => {
    applyLanguage(settings.language);
  });

  // ストレージ変更の監視
  const handleStorageChange = (
    changes: Record<string, { newValue?: unknown; oldValue?: unknown }>,
  ) => {
    if (changes.__default__?.newValue) {
      const newSettings = changes.__default__.newValue as Settings;
      if (newSettings.language) {
        applyLanguage(newSettings.language);
      }
    }
  };
  browser.storage.local.onChanged.addListener(handleStorageChange);
};

export const useLang = () => {
  React.useEffect(() => {
    initializeLang();
  }, []);

  const lang = React.useSyncExternalStore(langStore.subscribe, langStore.get);
  const { t } = useTranslation();

  return {
    t,
    lang,
    updateLanguage: (newLang: SupportedLanguage) => {
      applyLanguage(newLang);
    },
  };
};
