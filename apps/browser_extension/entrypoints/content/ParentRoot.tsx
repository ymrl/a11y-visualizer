import React from "react";
import { Announcements } from "./components/Announcements";
import { Keystrokes } from "./components/Keystrokes";
import { SettingsContext } from "./contexts/SettingsContext";
import { useAggregatedAnnouncements } from "./hooks/useAggregatedAnnouncements";
import { useAggregatedKeystrokes } from "./hooks/useAggregatedKeystrokes";

export const ParentRoot = () => {
  const settings = React.useContext(SettingsContext);
  const { announcements } = useAggregatedAnnouncements();
  const { keystrokes } = useAggregatedKeystrokes();

  return (
    <section
      aria-label="Accessibility Visualizer Announcements"
      aria-hidden="true"
      style={{
        position: "static",
        margin: 0,
        padding: 0,
      }}
    >
      {settings.showLiveRegions && (
        <Announcements announcements={announcements} />
      )}
      {settings.showKeystrokes && (
        <Keystrokes
          keystrokes={keystrokes}
          opacityPercent={settings.keystrokeOpacityPercent}
          fontSize={settings.keystrokeFontSize}
        />
      )}
    </section>
  );
};
