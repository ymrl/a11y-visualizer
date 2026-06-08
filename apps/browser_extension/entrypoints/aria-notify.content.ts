import { isHidden, isInAriaHidden } from "@a11y-visualizer/dom-utils";
import { defineContentScript } from "#imports";

const EVENT_NAME = "a11y-visualizer:aria-notify";
const ENABLE_EVENT_NAME = "a11y-visualizer:aria-notify-patch-enable";
const DISABLE_EVENT_NAME = "a11y-visualizer:aria-notify-patch-disable";

type AriaNotifyOptions = { priority?: string };
type AriaNotifyFn = (announcement: string, options?: AriaNotifyOptions) => void;

export default defineContentScript({
  matches: ["<all_urls>"],
  allFrames: true,
  world: "MAIN",
  main: () => {
    type AriaNotifyDocument = Document & { ariaNotify?: AriaNotifyFn };
    type AriaNotifyElementProto = Element & { ariaNotify?: AriaNotifyFn };

    const doc = document as AriaNotifyDocument;
    const origDocNotify = doc.ariaNotify ? doc.ariaNotify.bind(doc) : null;

    const elementProto = Element.prototype as AriaNotifyElementProto;
    const origElementNotify =
      typeof elementProto.ariaNotify === "function"
        ? elementProto.ariaNotify
        : null;

    let patched = false;

    const dispatch = (announcement: string, options?: AriaNotifyOptions) => {
      document.dispatchEvent(
        new CustomEvent(EVENT_NAME, {
          detail: {
            announcement: String(announcement),
            priority: String(options?.priority || "none"),
          },
        }),
      );
    };

    const applyPatch = () => {
      if (patched) return;
      patched = true;

      doc.ariaNotify = (announcement: string, options?: AriaNotifyOptions) => {
        dispatch(announcement, options);
        if (origDocNotify) {
          return origDocNotify(announcement, options);
        }
      };

      elementProto.ariaNotify = function (
        this: Element,
        announcement: string,
        options?: AriaNotifyOptions,
      ) {
        // aria-liveなどのライブリージョンと同様に、アクセシビリティツリーから
        // 除外されている要素では通知しない
        if (!isHidden(this) && !isInAriaHidden(this)) {
          dispatch(announcement, options);
        }
        if (origElementNotify) {
          return origElementNotify.call(this, announcement, options);
        }
      };
    };

    const removePatch = () => {
      if (!patched) return;
      patched = false;

      if (origDocNotify) {
        doc.ariaNotify = origDocNotify;
      } else {
        delete doc.ariaNotify;
      }

      if (origElementNotify) {
        elementProto.ariaNotify = origElementNotify;
      } else {
        delete elementProto.ariaNotify;
      }
    };

    document.addEventListener(ENABLE_EVENT_NAME, () => {
      applyPatch();
    });
    document.addEventListener(DISABLE_EVENT_NAME, () => {
      removePatch();
    });
  },
});
