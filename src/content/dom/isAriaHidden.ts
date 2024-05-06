export const isAriaHidden = (el: Element): boolean =>
  el.getAttribute("aria-hidden") === "true";

export const isInAriaHidden = (el: Element): boolean => {
  if (isAriaHidden(el)) {
    return true;
  }
  const parent = el.parentElement;
  if (!parent) {
    return false;
  }
  return isInAriaHidden(parent);
};
