const SizePropertiesWithoutWidth = [
  "height",
  "min-width",
  "min-height",
  "max-width",
  "max-height",
  "border-top-width",
  "border-right-width",
  "border-bottom-width",
  "border-left-width",
  "border-block-end-width",
  "border-block-start-width",
  "border-inline-end-width",
  "border-inline-start-width",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "padding-block-end",
  "padding-block-start",
  "padding-inline-end",
  "padding-inline-start",
  "box-sizing",
  "appearance",
  "opacity",
] as const;

const SizeProperties = ["width", ...SizePropertiesWithoutWidth] as const;

type SizeDeclaration = {
  [key in (typeof SizeProperties)[number]]: string;
};

type ElementType =
  | "button"
  | "input-text"
  | "input-search"
  | "input-date"
  | "input-month"
  | "input-week"
  | "input-time"
  | "input-datetime-local"
  | "input-range"
  | "input-color"
  | "input-checkbox"
  | "input-radio"
  | "input-file";
const DefaultStyles: Partial<{ [key in ElementType]: SizeDeclaration }> = {};

const elementType = (el: Element): ElementType | null => {
  const tagName = el.tagName.toLowerCase();
  if (tagName === "button") {
    return "button";
  }
  if (tagName === "input") {
    const type = el.getAttribute("type");
    if (!type) {
      return "input-text";
    }
    switch (type) {
      case "text":
      case "tel":
      case "url":
      case "email":
      case "password":
      case "number":
        return "input-text";
      case "search":
        return "input-search";
      case "date":
        return "input-date";
      case "month":
        return "input-month";
      case "week":
        return "input-week";
      case "time":
        return "input-time";
      case "datetime-local":
        return "input-datetime-local";
      case "range":
        return "input-range";
      case "color":
        return "input-color";
      case "checkbox":
        return "input-checkbox";
      case "radio":
        return "input-radio";
      case "file":
        return "input-file";
      case "submit":
      case "reset":
      case "button":
        return "button";
      default:
        return null;
    }
  }
  return null;
};

const getDefaultElement = (elementType: ElementType, d: Document): Element => {
  switch (elementType) {
    case "button": {
      const el = d.createElement("button");
      el.textContent = "hello";
      return el;
    }
    case "input-text": {
      const el = d.createElement("input");
      el.setAttribute("type", "text");
      return el;
    }
    case "input-search": {
      const el = d.createElement("input");
      el.setAttribute("type", "search");
      return el;
    }
    case "input-date": {
      const el = d.createElement("input");
      el.setAttribute("type", "date");
      return el;
    }
    case "input-month": {
      const el = d.createElement("input");
      el.setAttribute("type", "month");
      return el;
    }
    case "input-week": {
      const el = d.createElement("input");
      el.setAttribute("type", "week");
      return el;
    }
    case "input-time": {
      const el = d.createElement("input");
      el.setAttribute("type", "time");
      return el;
    }
    case "input-datetime-local": {
      const el = d.createElement("input");
      el.setAttribute("type", "datetime-local");
      return el;
    }
    case "input-range": {
      const el = d.createElement("input");
      el.setAttribute("type", "range");
      return el;
    }
    case "input-color": {
      const el = d.createElement("input");
      el.setAttribute("type", "color");
      return el;
    }
    case "input-checkbox": {
      const el = d.createElement("input");
      el.setAttribute("type", "checkbox");
      return el;
    }
    case "input-radio": {
      const el = d.createElement("input");
      el.setAttribute("type", "radio");
      return el;
    }
    case "input-file": {
      const el = d.createElement("input");
      el.setAttribute("type", "file");
      return el;
    }
  }
};

const getDefaultStyle = (el: Element): SizeDeclaration | undefined => {
  const type = elementType(el);
  if (!type) {
    return undefined;
  }
  if (DefaultStyles[type]) {
    return DefaultStyles[type];
  }

  const d = el.ownerDocument;
  const w = d.defaultView;
  if (!w) {
    return undefined;
  }

  const defaultEl = getDefaultElement(type, d);
  d.body.appendChild(defaultEl);
  if ("computedStyleMap" in defaultEl) {
    // Chrome
    const styles = defaultEl.computedStyleMap();
    const decls = Object.fromEntries(
      SizeProperties.map((prop: (typeof SizeProperties)[number]) => [
        prop,
        styles.get(prop)?.toString() || "",
      ]),
    ) as SizeDeclaration;
    DefaultStyles[type] = decls;
  } else {
    const styles = w.getComputedStyle(defaultEl);
    const decls = Object.fromEntries(
      (type === "button" ? SizePropertiesWithoutWidth : SizeProperties).map(
        (prop: (typeof SizeProperties)[number]) => [
          prop,
          styles.getPropertyValue(prop) || "",
        ],
      ),
    ) as SizeDeclaration;
    DefaultStyles[type] = decls;
  }
  d.body.removeChild(defaultEl);
  return DefaultStyles[type];
};

export const isDefaultSize = (el: Element): boolean => {
  const defaultStyle = getDefaultStyle(el);

  if (!defaultStyle) {
    return false;
  }
  if ("computedStyleMap" in el) {
    const elementStyle = el.computedStyleMap();
    return SizeProperties.every(
      (prop) => defaultStyle[prop] === elementStyle.get(prop)?.toString(),
    );
  }
  // `computedStyleMap` is not in the Element interface in TypeScript
  // But computedStyleMap is not supported in Firefox
  const typedEl: Element = el as Element; // casting `never` to `Element`
  const type = elementType(typedEl);
  const d = typedEl.ownerDocument as Document;
  const w = d?.defaultView;
  if (!w) {
    return false;
  }
  const elementStyle = w.getComputedStyle(typedEl);
  return (
    type === "button" ? SizePropertiesWithoutWidth : SizeProperties
  ).every((prop) => defaultStyle[prop] === elementStyle.getPropertyValue(prop));
};
