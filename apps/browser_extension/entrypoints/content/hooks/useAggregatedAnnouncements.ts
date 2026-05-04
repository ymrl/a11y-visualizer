import React from "react";
import {
  isA11yVisualizerMessage,
  type LiveRegionMessageData,
} from "../shared/protocol";
import type { AnnouncementItem, LiveLevel } from "../types";

export const useAggregatedAnnouncements = () => {
  const [announcements, setAnnouncements] = React.useState<AnnouncementItem[]>(
    [],
  );
  const [pausedAnnouncements, setPausedAnnouncements] = React.useState<
    AnnouncementItem[]
  >([]);
  const currentTimeoutRef = React.useRef<number | null>(null);

  const removeFirstAnnouncement = React.useCallback(() => {
    setAnnouncements((prev) => prev.slice(1));
    currentTimeoutRef.current = null;
  }, []);

  const addAnnouncement = React.useCallback(
    (content: string, level: LiveLevel, duration: number) => {
      const timestamp = Date.now();
      const announcement: AnnouncementItem = {
        content,
        level,
        duration,
        timestamp,
      };
      setAnnouncements((prev) => [...prev, announcement]);
    },
    [],
  );

  const clearAnnouncements = React.useCallback(() => {
    if (currentTimeoutRef.current) {
      window.clearTimeout(currentTimeoutRef.current);
      currentTimeoutRef.current = null;
    }
    setAnnouncements((prev) => (prev.length > 0 ? [] : prev));
    setPausedAnnouncements((prev) => (prev.length > 0 ? [] : prev));
  }, []);

  const pauseAnnouncements = React.useCallback(() => {
    if (currentTimeoutRef.current) {
      window.clearTimeout(currentTimeoutRef.current);
      currentTimeoutRef.current = null;
    }
    setPausedAnnouncements(announcements);
    setAnnouncements([]);
  }, [announcements]);

  const resumeAnnouncements = React.useCallback(() => {
    setAnnouncements((prev) => [...prev, ...pausedAnnouncements]);
    setPausedAnnouncements([]);
  }, [pausedAnnouncements]);

  const pauseOrResumeAnnouncements = React.useCallback(() => {
    if (announcements.length > 0) {
      pauseAnnouncements();
    } else {
      resumeAnnouncements();
    }
  }, [announcements, pauseAnnouncements, resumeAnnouncements]);

  // Timer management for announcements
  React.useEffect(() => {
    if (announcements.length === 0) {
      if (currentTimeoutRef.current) {
        window.clearTimeout(currentTimeoutRef.current);
        currentTimeoutRef.current = null;
      }
      return;
    }
    if (currentTimeoutRef.current) {
      return;
    }
    const firstAnnouncement = announcements[0];
    currentTimeoutRef.current = window.setTimeout(() => {
      removeFirstAnnouncement();
    }, firstAnnouncement.duration);
  }, [announcements, removeFirstAnnouncement]);

  // Listen for postMessage from child frames
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!isA11yVisualizerMessage(event.data)) return;
      if (event.data.type !== "a11y-visualizer:live-region") return;
      const msg = event.data as LiveRegionMessageData;
      const { content, level, duration } = msg.data;

      if (level === "assertive") {
        clearAnnouncements();
      }
      addAnnouncement(content, level, duration);
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [addAnnouncement, clearAnnouncements]);

  // Keyboard/touch/focus listeners for clearing/pausing
  React.useEffect(() => {
    if (announcements.length === 0 && pausedAnnouncements.length === 0) {
      return;
    }
    const keyListener = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        pauseOrResumeAnnouncements();
      } else if (e.key === "Control") {
        clearAnnouncements();
      }
    };
    const touchStartListener = () => {
      clearAnnouncements();
    };

    window.addEventListener("keydown", keyListener);
    window.addEventListener("focusin", clearAnnouncements);
    window.addEventListener("touchstart", touchStartListener, {
      passive: true,
    });

    return () => {
      window.removeEventListener("keydown", keyListener);
      window.removeEventListener("focusin", clearAnnouncements);
      window.removeEventListener("touchstart", touchStartListener);
    };
  }, [
    announcements,
    clearAnnouncements,
    pauseOrResumeAnnouncements,
    pausedAnnouncements,
  ]);

  return { announcements };
};
