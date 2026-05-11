import { defineContentScript } from "#imports";

const EVENT_NAME = "a11y-visualizer:aria-notify";
const ENABLE_EVENT_NAME = "a11y-visualizer:aria-notify-enable";

export default defineContentScript({
  matches: ["<all_urls>"],
  allFrames: true,
  world: "MAIN",
  main: () => {
    type AriaNotifyDocument = Document & {
      ariaNotify?: (
        announcement: string,
        options?: { priority?: string },
      ) => void;
    };
    const doc = document as AriaNotifyDocument;
    const orig = doc.ariaNotify ? doc.ariaNotify.bind(doc) : null;
    let patched = false;

    const applyPatch = () => {
      if (patched) return;
      patched = true;
      doc.ariaNotify = (
        announcement: string,
        options?: { priority?: string },
      ) => {
        document.dispatchEvent(
          new CustomEvent(EVENT_NAME, {
            detail: {
              announcement: String(announcement),
              priority: String(options?.priority || "none"),
            },
          }),
        );
        if (orig) {
          return orig(announcement, options);
        }
      };
    };

    const removePatch = () => {
      if (!patched) return;
      patched = false;
      if (orig) {
        doc.ariaNotify = orig;
      } else {
        delete doc.ariaNotify;
      }
    };

    document.addEventListener(ENABLE_EVENT_NAME, (e: Event) => {
      const { enabled } = (e as CustomEvent).detail as { enabled: boolean };
      if (enabled) {
        applyPatch();
      } else {
        removePatch();
      }
    });
  },
});
