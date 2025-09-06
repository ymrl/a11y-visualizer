import type React from "react";
import type { Settings } from "../../../src/settings";
import { SettingsContext } from "../contexts/SettingsContext";

export const SettingsProvider = ({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings: Settings;
}) => {
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};
