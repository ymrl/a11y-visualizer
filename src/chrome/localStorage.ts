export const getAsync = async <T extends object>(
  key: string,
  initialData: T,
): Promise<[T, boolean]> => {
  const data = await chrome.storage.local.get(key);
  return [
    {
      ...initialData,
      ...(data[key] || {}),
    },
    key in data,
  ];
};

export const setAsync = async <T extends object>(
  key: string,
  data: T,
): Promise<void> => {
  await chrome.storage.local.set({ [key]: data });
};
