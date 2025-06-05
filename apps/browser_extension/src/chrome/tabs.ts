import { SettingsMessage } from "../settings";

export const sendMessageToActiveTab = async <
  T extends SettingsMessage,
  R = unknown,
>(
  message: T,
) => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  tabs.forEach(({ id }) => id && chrome.tabs.sendMessage<T, R>(id, message));
};

export const sendMessageToActiveTabs = async <
  T extends SettingsMessage,
  R = unknown,
>(
  message: T,
) => {
  const tabs = await chrome.tabs.query({ active: true });
  tabs.forEach(({ id }) => id && chrome.tabs.sendMessage<T, R>(id, message));
};
