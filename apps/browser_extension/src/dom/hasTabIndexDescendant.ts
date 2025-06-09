export const hasTabIndexDescendant = (el: Element): boolean => {
  return !!el.querySelector("[tabindex]");
};
