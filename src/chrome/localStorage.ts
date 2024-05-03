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