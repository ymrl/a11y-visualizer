import { browser } from "#imports";
import { SettingsMessage } from "../settings";

export const sendMessageToActiveTab = async <
  T extends SettingsMessage,
  R = unknown,
>(
  message: T,
) => {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  tabs.forEach(({ id }) => id && browser.tabs.sendMessage<T, R>(id, message));
};

export const sendMessageToActiveTabs = async <
  T extends SettingsMessage,
  R = unknown,
>(
  message: T,
) => {
  const tabs = await browser.tabs.query({ active: true });
  tabs.forEach(({ id }) => id && browser.tabs.sendMessage<T, R>(id, message));
};
