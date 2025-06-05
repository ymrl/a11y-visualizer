const FOCUSABLE_SELECTOR = [
  "a[href]",
  "map > area[href]",
  "button",
  "input:not([type=hidden])",
  "object",
  "select",
  "textarea",
  "details > summary",
  "[tabindex]",
].join(", ");
export const isFocusable = (
  element: Element,
  keyboard: boolean = false,
): boolean => {
  const matches = element.matches(FOCUSABLE_SELECTOR);
  if (keyboard && matches) {
    const tabindex = element.getAttribute("tabindex");
    return tabindex === null || parseInt(tabindex) >= 0;
  }
  return matches;
};
