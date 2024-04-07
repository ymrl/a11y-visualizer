import { Settings } from "../types";

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    const settings: Settings = {
      accessibilityInfo: false,
      image: true,
      formControl: true,
      link: true,
      heading: true,
    };
    chrome.storage.local.set({
      settings,
    });
  }
});
