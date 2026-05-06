import { defineContentScript } from "#imports";
export default defineContentScript({
  matches: ["<all_urls>"],
  allFrames: true,
  matchAboutBlank: true,
  main: async () => {
    const { injectAllFramesRoot } = await import("./injectAllFramesRoot");

    let srcdoc = false;
    try {
      srcdoc = !!window.frameElement?.hasAttribute?.("srcdoc");
    } catch {
      /* cross-origin: frameElement access throws */
    }

    injectAllFramesRoot(window, window.document.body, { srcdoc });
  },
});
