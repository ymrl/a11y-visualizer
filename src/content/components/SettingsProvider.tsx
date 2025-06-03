import React from "react";
import { Settings } from "../../settings";
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
