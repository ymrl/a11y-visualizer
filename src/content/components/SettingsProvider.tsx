import React from "react";
import { Settings } from "../../types";
import { initialSettings } from "../../initialSettings";

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
