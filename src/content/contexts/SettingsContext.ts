import React from "react";
import { Settings, initialSettings } from "../../settings";
export const SettingsContext = React.createContext<Settings>(initialSettings);
