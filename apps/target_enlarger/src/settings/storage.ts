import { browser } from "wxt/browser";
import { TargetEnlargerSettings } from "./types";

const DEFAULT_SETTINGS: TargetEnlargerSettings = {
  enabled: true,
  minTargetSize: 24,
  overlayOpacity: 0.3,
  overlayColor: "#0066cc",
  showTooltips: false,
  enableIframes: true,
};

export const loadSettings = async (): Promise<TargetEnlargerSettings> => {
  const result = await browser.storage.sync.get(DEFAULT_SETTINGS);
  return {
    enabled: result.enabled,
    minTargetSize: result.minTargetSize,
    overlayOpacity: result.overlayOpacity,
    overlayColor: result.overlayColor,
    showTooltips: result.showTooltips,
    enableIframes: result.enableIframes,
  };
};

export const saveSettings = async (
  settings: Partial<TargetEnlargerSettings>,
): Promise<void> => {
  await browser.storage.sync.set(settings);
};

export const resetSettings = async (): Promise<TargetEnlargerSettings> => {
  await browser.storage.sync.clear();
  return DEFAULT_SETTINGS;
};
