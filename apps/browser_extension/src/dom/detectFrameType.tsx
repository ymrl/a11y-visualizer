export type FrameType = "top" | "iframe" | "legacy-frame";
export const detectFrameType = (): FrameType => {
  try {
    if (window.frameElement?.tagName === "FRAME") {
      return "legacy-frame";
    }
  } catch {
    /* cross-origin: frameElement access throws */
  }
  if (window.parent !== window) {
    return "iframe";
  }
  return "top";
};
