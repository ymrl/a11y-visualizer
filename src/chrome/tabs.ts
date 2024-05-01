export const queryAsync = (
  queryInfo: chrome.tabs.QueryInfo,
): Promise<chrome.tabs.Tab[]> => {
  return new Promise((resolve) => {
    chrome.tabs.query(queryInfo, resolve);
  });
};

export const sendMessageAsync = <T, R = unknown>(
  tabId: number,
  message: T,
): Promise<R> => {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage<T, R>(tabId, message, (response) => {
      resolve(response);
    });
  });
};
