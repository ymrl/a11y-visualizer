import { defineContentScript } from "#imports";
export default defineContentScript({
  matches: ["<all_urls>"],
  main: async () => {
    const { injectParentRoot } = await import("./injectParentRoot");
    injectParentRoot(window, window.document.body);
  },
});
