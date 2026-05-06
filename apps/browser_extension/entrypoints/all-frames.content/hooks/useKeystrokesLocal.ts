import React from "react";
import { SettingsContext } from "../../content/contexts/SettingsContext";
import { createKeystrokeMessage } from "../../content/shared/protocol";
import type { KeystrokeItem } from "../../content/types";
import { formatKeyEvent } from "../../content/utils/formatKeyEvent";

const MAX_ITEMS = 20;

type ForwardMode = "postMessage" | "self";

export const useKeystrokesLocal = ({
  forwardMode,
}: {
  forwardMode: ForwardMode;
}) => {
  const { showKeystrokes, keystrokeDisplaySeconds } =
    React.useContext(SettingsContext);
  // Self-mode state (for legacy frames)
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

    const handleKeydown = (e: KeyboardEvent) => {
      const keys = formatKeyEvent(e);
      const timestamp = Date.now();

      if (forwardMode === "postMessage") {
        const msg = createKeystrokeMessage(keys, timestamp);
        window.parent.postMessage(msg, "*");
      } else {
        setKeystrokes((prev) =>
          [{ keys, timestamp }, ...prev].slice(0, MAX_ITEMS),
        );
        setTimeout(() => {
          setKeystrokes((prev) =>
            prev.filter((item) => item.timestamp !== timestamp),
          );
        }, keystrokeDisplaySecondsRef.current * 1000);
      }
    };

    window.addEventListener("keydown", handleKeydown, true);
    return () => {
      window.removeEventListener("keydown", handleKeydown, true);
    };
  }, [showKeystrokes, forwardMode]);

  return { keystrokes };
};
