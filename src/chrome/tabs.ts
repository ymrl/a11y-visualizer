export const sendMessageToActiveTab = async <T, R = unknown>(message: T) => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  tabs.forEach(({ id }) => id && chrome.tabs.sendMessage<T, R>(id, message));
};
