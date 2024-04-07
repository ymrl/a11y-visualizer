import React from "react";
import i18n from "./i18n";
import { useTranslation } from "react-i18next";

export const useLang = () => {
  React.useEffect(() => {
    const chromeLang = chrome.i18n.getUILanguage();
    const lang = chromeLang.match(/^ja/) ? "ja" : "en";
    i18n.changeLanguage(lang);
  }, []);
  const { t } = useTranslation();
  return t;
};
