export const ENABLED_KEY = "__enabled__";

export const loadEnabled = async (): Promise<boolean> => {
  const data = await chrome.storage.local.get(ENABLED_KEY);
  return data[ENABLED_KEY] ?? false;
};

export const saveEnabled = async (enabled: boolean): Promise<void> => {
  await chrome.storage.local.set({ [ENABLED_KEY]: enabled });
};
