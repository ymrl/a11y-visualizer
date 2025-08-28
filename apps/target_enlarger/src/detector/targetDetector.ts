interface ElementPosition {
  x: number;
  y: number;
  absoluteX: number;
  absoluteY: number;
  width: number;
  height: number;
}

const tagNames = ["button", "select", "textarea"];
const roles = [
  "button",
  "menuitem",
  "tab",
  "checkbox",
  "combobox",
  "listbox",
  "radio",
  "searchbox",
  "slider",
  "spinbutton",
  "switch",
  "textbox",
  "menuitemcheckbox",
  "menuitemradio",
  "link",
];
const selectors = [
  'input:not([type="hidden"])',
  "details > summary:first-child",
  "a[href]",
  "area[href]",
];
const COMBINED_SELECTOR = [
  ...tagNames,
  ...selectors,
  ...roles.map((role) => `[role="${role}"]`),
].join(", ");

export interface SmallTargetInfo {
  element: Element;
  position: ElementPosition;
  recommendedSize: { width: number; height: number };
}

export const detectSmallTargets = (
  document: Document,
  window: Window,
  minSize: number = 24,
): SmallTargetInfo[] => {
  const allTargets = document.querySelectorAll(COMBINED_SELECTOR);
  const smallTargets: SmallTargetInfo[] = [];

  for (const element of allTargets) {
    if (isSmallTarget(element, document, window, minSize)) {
      const position = getElementPosition(element, window);
      const recommendedSize = calculateRecommendedSize(position, minSize);

      if (
        !hasAdequateSpacing(element, document, minSize) ||
        !hasOtherTargetsInDocument(element, document)
      ) {
        smallTargets.push({
          element,
          position,
          recommendedSize,
        });
      }
    }
  }

  return smallTargets;
};

const getElementPosition = (
  el: Element,
  w: Window,
  offsetX: number = 0,
  offsetY: number = 0,
): ElementPosition => {
  if (el.tagName.toLowerCase() === "area") {
    return getAreaElementPosition(el, w, offsetX, offsetY);
  }
  const scrollX = w.scrollX;
  const scrollY = w.scrollY;

  const rect = el.getBoundingClientRect();
  return {
    x: rect.x + scrollX - offsetX,
    y: rect.y + scrollY - offsetY,
    absoluteX: rect.x + scrollX,
    absoluteY: rect.y + scrollY,
    width: rect.width,
    height: rect.height,
  };
};

const getAreaElementPosition = (
  el: Element,
  w: Window,
  offsetX: number = 0,
  offsetY: number = 0,
): ElementPosition => {
  const map = el.closest("map");
  const img = map?.id
    ? map.ownerDocument.querySelector(`img[usemap="#${map.id}"]`)
    : map?.name
      ? map.ownerDocument.querySelector(`img[usemap="#${map.name}"]`)
      : null;
  const rect = (img || el).getBoundingClientRect();
  const coords = el.getAttribute("coords")?.split(",").map(Number);
  const shape = el.getAttribute("shape");
  const scrollX = w.scrollX;
  const scrollY = w.scrollY;

  if (coords && (shape === "rect" || !shape) && coords.length >= 4) {
    return {
      x: rect.x + coords[0] + scrollX - offsetX,
      y: rect.y + coords[1] + scrollY - offsetY,
      absoluteX: rect.x + coords[0] + scrollX,
      absoluteY: rect.y + coords[1] + scrollY,
      width: coords[2] - coords[0],
      height: coords[3] - coords[1],
    };
  }
  if (coords && shape === "circle" && coords.length >= 3) {
    return {
      x: rect.x + coords[0] - coords[2] + scrollX - offsetX,
      y: rect.y + coords[1] - coords[2] + scrollY - offsetY,
      absoluteX: rect.x + coords[0] - coords[2] + scrollX,
      absoluteY: rect.y + coords[1] - coords[2] + scrollY,
      width: coords[2] * 2,
      height: coords[2] * 2,
    };
  }
  if (coords && shape === "poly" && coords.length >= 6) {
    const absoluteX =
      rect.x + Math.min(...coords.filter((_, i) => i % 2 === 0)) + scrollX;
    const absoluteY =
      rect.y + Math.min(...coords.filter((_, i) => i % 2 === 1)) + scrollY;
    return {
      x: absoluteX - offsetX,
      y: absoluteY - offsetY,
      absoluteX,
      absoluteY,
      width:
        Math.max(...coords.filter((_, i) => i % 2 === 0)) -
        Math.min(...coords.filter((_, i) => i % 2 === 0)),
      height:
        Math.max(...coords.filter((_, i) => i % 2 === 1)) -
        Math.min(...coords.filter((_, i) => i % 2 === 1)),
    };
  }
  return {
    x: rect.x + scrollX - offsetX,
    y: rect.y + scrollY - offsetY,
    absoluteX: rect.x + scrollX,
    absoluteY: rect.y + scrollY,
    width: rect.width,
    height: rect.height,
  };
};

const isSmallTarget = (
  element: Element,
  elementDocument: Document,
  elementWindow: Window,
  minSize: number,
): boolean => {
  const elementPosition = getElementPosition(element, elementWindow);
  const style = elementWindow.getComputedStyle(element);
  const { display } = style;

  if (elementPosition.width >= minSize && elementPosition.height >= minSize) {
    return false;
  }

  const checkboxLabel =
    isCheckboxOrRadiobutton(element) &&
    ((element.id &&
      elementDocument.querySelector(`[for="${CSS.escape(element.id)}"]`)) ||
      element.closest("label"));

  if (checkboxLabel) {
    return isSmallTarget(
      checkboxLabel,
      elementDocument,
      elementWindow,
      minSize,
    );
  }

  if (
    display === "inline" &&
    [...element.children].some((child) => {
      if (isCheckboxOrRadiobutton(child)) {
        return false;
      }
      return !isSmallTarget(child, elementDocument, elementWindow, minSize);
    })
  ) {
    return false;
  }

  return true;
};

const hasAdequateSpacing = (
  element: Element,
  elementDocument: Document,
  minSize: number,
): boolean => {
  const hasOtherTargets = hasOtherTargetsInDocument(element, elementDocument);
  if (!hasOtherTargets) {
    return false;
  }

  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const halfSize = minSize / 2;

  const checkPoints = [
    { x: centerX - halfSize, y: centerY - halfSize },
    { x: centerX, y: centerY - halfSize },
    { x: centerX + halfSize, y: centerY - halfSize },
    { x: centerX - halfSize, y: centerY },
    { x: centerX + halfSize, y: centerY },
    { x: centerX - halfSize, y: centerY + halfSize },
    { x: centerX, y: centerY + halfSize },
    { x: centerX + halfSize, y: centerY + halfSize },
  ];

  for (const point of checkPoints) {
    if (hasTargetElementAtPoint(point.x, point.y, elementDocument, element)) {
      return false;
    }
  }

  return true;
};

const hasTargetElementAtPoint = (
  x: number,
  y: number,
  doc: Document,
  excludeElement: Element,
): boolean => {
  const elementsAtPoint = doc.elementsFromPoint(x, y);
  if (!elementsAtPoint || elementsAtPoint.length === 0) {
    return false;
  }

  let targetElement: Element | null = null;
  for (const element of elementsAtPoint) {
    if (isExtensionElement(element)) {
      continue;
    }
    targetElement = element;
    break;
  }

  if (!targetElement) {
    return false;
  }

  let current: Element | null = targetElement;
  while (current) {
    if (current === excludeElement) {
      break;
    }

    if (current.matches(COMBINED_SELECTOR)) {
      return true;
    }

    current = current.parentElement;
  }

  return false;
};

const isExtensionElement = (element: Element): boolean => {
  let current: Element | null = element;
  while (current) {
    if (current.hasAttribute("data-target-enlarger-extension")) {
      return true;
    }
    current = current.parentElement;
  }
  return false;
};

const hasOtherTargetsInDocument = (
  element: Element,
  elementDocument: Document,
): boolean => {
  const allTargets = elementDocument.querySelectorAll(COMBINED_SELECTOR);

  for (const target of allTargets) {
    if (target !== element) {
      return true;
    }
  }

  return false;
};

const isCheckboxOrRadiobutton = (element: Element): boolean => {
  const tagName = element.tagName.toLowerCase();
  const typeAttr = element.getAttribute("type");
  return (
    tagName === "input" && (typeAttr === "checkbox" || typeAttr === "radio")
  );
};

const calculateRecommendedSize = (
  position: ElementPosition,
  minSize: number,
): { width: number; height: number } => {
  return {
    width: Math.max(position.width, minSize),
    height: Math.max(position.height, minSize),
  };
};
