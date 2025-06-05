import React from "react";
import i18n from "./i18n";
import { useTranslation } from "react-i18next";

export const useLang = () => {
  const [lang, setLang] = React.useState<string>("en");

  React.useEffect(() => {
    const chromeLang = chrome.i18n.getUILanguage();
    const uiLang = chromeLang.match(/^ja/)
      ? "ja"
      : chromeLang.match(/^ko/)
        ? "ko"
        : "en";
    setLang(uiLang);
    i18n.changeLanguage(uiLang);
  }, []);
  const { t } = useTranslation();
  return { t, lang };
};
