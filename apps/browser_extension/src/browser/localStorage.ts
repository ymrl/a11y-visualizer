import { browser } from "#imports";
export const getAsync = async <T extends object>(
  key: string,
  initialData: T,
): Promise<[T, boolean]> => {
  const data = await browser.storage.local.get(key);
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
  await browser.storage.local.set({ [key]: data });
};

export const removeAsync = async (key: string): Promise<void> => {
  await browser.storage.local.remove(key);
};
