import React from "react";
import { Settings } from "../../types";

export const SettingsContext = React.createContext<Settings>({
  accessibilityInfo: false,
  image: true,
  formControl: true,
  link: true,
  heading: true,
  ariaHidden: true,
});

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
