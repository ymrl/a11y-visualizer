export const getAsync = <T extends object>(
  key: string,
  initialData: T,
): Promise<T> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, (data) => {
      resolve({
        ...initialData,
        ...(data[key] || {}),
      });
    });
  });
};

export const setAsync = <T extends object>(
  key: string,
  data: T,
): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: data }, resolve);
  });
};
