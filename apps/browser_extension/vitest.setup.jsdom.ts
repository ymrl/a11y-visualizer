// Polyfills for running tests in jsdom inside a restricted sandbox

// CSS.escape polyfill (very naive but sufficient for tests)
if (!(globalThis.CSS)) {
  globalThis.CSS = {} as typeof globalThis.CSS;
}
if (typeof globalThis.CSS.escape !== "function") {
  globalThis.CSS.escape = (value: string) =>
    String(value).replace(/[^a-zA-Z0-9_-]/g, (c) => `\\${c}`);
}

// Document.elementsFromPoint polyfill using inline style boxes (absolute/fixed)
if (typeof Document.prototype.elementsFromPoint !== "function") {
  Object.defineProperty(Document.prototype, "elementsFromPoint", {
    value(this: Document, x: number, y: number) {
      const all = Array.from(this.querySelectorAll<HTMLElement>("*"));
      const result: Element[] = [];
      for (const el of all) {
        const style = el.style;
        const left = parseFloat(style.left || "NaN");
        const top = parseFloat(style.top || "NaN");
        const width = parseFloat(style.width || "NaN");
        const height = parseFloat(style.height || "NaN");
        const pos = style.position;

        if (
          !Number.isFinite(left) ||
          !Number.isFinite(top) ||
          !Number.isFinite(width) ||
          !Number.isFinite(height)
        ) {
          continue;
        }
        if (pos !== "absolute" && pos !== "fixed" && pos !== "relative") {
          continue;
        }
        if (x >= left && x <= left + width && y >= top && y <= top + height) {
          result.push(el);
        }
      }
      return result;
    },
  });
}

// Ensure contentEditable property reflects to attribute in jsdom
try {
  const desc = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "contentEditable",
  );
  if (!desc || desc.configurable) {
    Object.defineProperty(HTMLElement.prototype, "contentEditable", {
      get(this: HTMLElement) {
        return this.getAttribute("contenteditable") ?? "inherit";
      },
      set(this: HTMLElement, v: string) {
        this.setAttribute("contenteditable", String(v));
      },
      configurable: true,
    });
  }
} catch {
  // ignore if property is not configurable
}
