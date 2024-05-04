import React from "react";
import { Settings, initialSettings } from "../../settings";

export const SettingsContext = React.createContext<Settings>(initialSettings);

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
