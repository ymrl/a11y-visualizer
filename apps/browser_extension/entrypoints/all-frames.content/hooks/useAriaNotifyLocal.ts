import React from "react";
import { SettingsContext } from "../../content/contexts/SettingsContext";
import type { LiveLevel } from "../../content/types";

const EVENT_NAME = "a11y-visualizer:aria-notify";
const ENABLE_EVENT_NAME = "a11y-visualizer:aria-notify-enable";

export const useAriaNotifyLocal = ({
  addAnnouncement,
}: {
  addAnnouncement: (content: string, level: LiveLevel) => void;
}) => {
  const { announceAriaNotify, showLiveRegions } =
    React.useContext(SettingsContext);

  const enabled = announceAriaNotify && showLiveRegions;

  React.useEffect(() => {
    document.dispatchEvent(
      new CustomEvent(ENABLE_EVENT_NAME, { detail: { enabled } }),
    );

    if (!enabled) return;

    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        announcement: string;
        priority: string;
      };
      if (!detail || !detail.announcement) return;

      const level: LiveLevel =
        detail.priority === "high" ? "assertive" : "polite";
      addAnnouncement(detail.announcement, level);
    };

    document.addEventListener(EVENT_NAME, handler);

    return () => {
      document.removeEventListener(EVENT_NAME, handler);
      document.dispatchEvent(
        new CustomEvent(ENABLE_EVENT_NAME, { detail: { enabled: false } }),
      );
    };
  }, [enabled, addAnnouncement]);
};
