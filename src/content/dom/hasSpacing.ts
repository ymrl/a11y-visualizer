const InteractiveElements = [
  "a",
  "button",
  "input",
  "select",
  "textarea",
  "summary",
  "[contenteditable]",
];
const InteractiveSelectors = `${InteractiveElements.join(", ")}, ${InteractiveElements.map((e) => `${e} *`).join(", ")}`;

export const hasSpacing = (
  el: Element,
  d: Document = el.ownerDocument,
  w: Window | null = d.defaultView,
): boolean => {
  if (!w) return false;
  const parent = el.parentElement;
  if (!parent) return false;
  const rect = el.getBoundingClientRect();
  const smallHeight = rect.height < 24;
  const smallWidth = rect.width < 24;
  if (!smallHeight && !smallWidth) return true;

  const centerX = Math.floor(rect.left + rect.width / 2);
  const centerY = Math.floor(rect.top + rect.height / 2);
  for (let y = centerY - 12; y <= centerY + 12; y++) {
    for (let x = centerX - 12; x <= centerX + 12; x++) {
      // rectの部分を除外
      if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      )
        continue;
      // centerへの距離が12pxより大きい場合は除外
      if (Math.sqrt((centerX - x) ** 2 + (centerY - y) ** 2) > 12) continue;
      const element = d.elementFromPoint(x, y);
      // インタラクティブな要素か、インタラクティブな要素の子孫ならfalse
      if (element && element.matches(InteractiveSelectors)) return false;
    }
  }
  return true;
};
