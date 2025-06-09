import { browser } from "#imports";
import React from "react";
import i18n from "./i18n";
import { useTranslation } from "react-i18next";

export const useLang = () => {
  const [lang, setLang] = React.useState<string>("en");

  React.useEffect(() => {
    const browserLang = browser.i18n.getUILanguage();
    const uiLang = browserLang.match(/^ja/)
      ? "ja"
      : browserLang.match(/^ko/)
        ? "ko"
        : "en";
    setLang(uiLang);
    i18n.changeLanguage(uiLang);
  }, []);
  const { t } = useTranslation();
  return { t, lang };
};
