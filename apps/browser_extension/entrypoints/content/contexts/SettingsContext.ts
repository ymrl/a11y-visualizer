import React from "react";
import { initialSettings, type Settings } from "../../../src/settings";
export const SettingsContext = React.createContext<Settings>(initialSettings);
