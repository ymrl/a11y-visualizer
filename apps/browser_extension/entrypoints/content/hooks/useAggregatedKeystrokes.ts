import React from "react";
import { SettingsContext } from "../contexts/SettingsContext";
import {
  isA11yVisualizerMessage,
  type KeystrokeMessageData,
} from "../shared/protocol";
import type { KeystrokeItem } from "../types";

const MAX_ITEMS = 20;

export const useAggregatedKeystrokes = () => {
  const { showKeystrokes, keystrokeDisplaySeconds } =
    React.useContext(SettingsContext);
  const [keystrokes, setKeystrokes] = React.useState<KeystrokeItem[]>([]);
  const keystrokeDisplaySecondsRef = React.useRef(keystrokeDisplaySeconds);

  React.useEffect(() => {
    keystrokeDisplaySecondsRef.current = keystrokeDisplaySeconds;
  }, [keystrokeDisplaySeconds]);

  React.useEffect(() => {
    if (!showKeystrokes) {
      setKeystrokes([]);
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (!isA11yVisualizerMessage(event.data)) return;
      if (event.data.type !== "a11y-visualizer:keystroke") return;
      const msg = event.data as KeystrokeMessageData;
      const { keys, timestamp } = msg.data;

      setKeystrokes((prev) =>
        [{ keys, timestamp }, ...prev].slice(0, MAX_ITEMS),
      );

      setTimeout(() => {
        setKeystrokes((prev) =>
          prev.filter((item) => item.timestamp !== timestamp),
        );
      }, keystrokeDisplaySecondsRef.current * 1000);
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [showKeystrokes]);

  return { keystrokes };
};
