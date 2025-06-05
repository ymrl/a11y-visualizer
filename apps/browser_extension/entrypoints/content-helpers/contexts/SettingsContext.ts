import React from "react";
import { Settings, initialSettings } from "../../../src/settings";
export const SettingsContext = React.createContext<Settings>(initialSettings);
