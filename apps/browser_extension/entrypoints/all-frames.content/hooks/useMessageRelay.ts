import React from "react";
import { isA11yVisualizerMessage } from "../../content/shared/protocol";

type ForwardMode = "postMessage" | "self";

export const useMessageRelay = ({
  forwardMode,
}: {
  forwardMode: ForwardMode;
}) => {
  React.useEffect(() => {
    // Only relay if we are an iframe forwarding to parent
    if (forwardMode !== "postMessage") return;
    if (window.parent === window) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.source === window) return;
      if (!isA11yVisualizerMessage(event.data)) return;
      window.parent.postMessage(event.data, "*");
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [forwardMode]);
};
