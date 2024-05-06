import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en.json";
import ja from "./ja.json";
import ko from "./ko.json";

i18n.use(initReactI18next).init({
  resources: {
    ja: {
      translation: ja,
    },
    en: {
      translation: en,
    },
    ko: {
      translation: ko,
    },
  },
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
