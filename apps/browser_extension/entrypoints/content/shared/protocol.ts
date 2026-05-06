const MESSAGE_PREFIX = "a11y-visualizer:";

export type KeystrokeMessageData = {
  type: `${typeof MESSAGE_PREFIX}keystroke`;
  data: {
    keys: string;
    timestamp: number;
  };
};

export type LiveRegionMessageData = {
  type: `${typeof MESSAGE_PREFIX}live-region`;
  data: {
    content: string;
    level: "polite" | "assertive";
    duration: number;
    timestamp: number;
  };
};

export type A11yVisualizerMessage =
  | KeystrokeMessageData
  | LiveRegionMessageData;

export const isA11yVisualizerMessage = (
  data: unknown,
): data is A11yVisualizerMessage => {
  if (typeof data !== "object" || data === null) return false;
  const msg = data as Record<string, unknown>;
  if (typeof msg.type !== "string") return false;
  if (!msg.type.startsWith(MESSAGE_PREFIX)) return false;
  if (typeof msg.data !== "object" || msg.data === null) return false;
  return true;
};

export const createKeystrokeMessage = (
  keys: string,
  timestamp: number,
): KeystrokeMessageData => ({
  type: `${MESSAGE_PREFIX}keystroke`,
  data: { keys, timestamp },
});

export const createLiveRegionMessage = (
  content: string,
  level: "polite" | "assertive",
  duration: number,
  timestamp: number,
): LiveRegionMessageData => ({
  type: `${MESSAGE_PREFIX}live-region`,
  data: { content, level, duration, timestamp },
});
