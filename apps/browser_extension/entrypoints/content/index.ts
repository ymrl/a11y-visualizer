import { defineContentScript } from "#imports";
export default defineContentScript({
  matches: ["<all_urls>"],
  main: async () => {
    const { injectRoot } = await import("./injectRoot");

    // injectRootを一度だけ呼び出し、内部の状態管理に任せる
    injectRoot(window, window.document.body, { mountOnce: false });
  },
});
