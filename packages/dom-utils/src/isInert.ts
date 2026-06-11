export const isInert = (el: Element): boolean => {
  if (el.hasAttribute("inert")) {
    return true;
  }
  const w = el.ownerDocument.defaultView;
  if (
    w &&
    w.getComputedStyle(el).getPropertyValue("interactivity") === "inert"
  ) {
    return true;
  }
  return false;
};

export const isInInert = (el: Element): boolean => {
  if (isInert(el)) {
    return true;
  }
  if (el.parentElement) {
    return isInInert(el.parentElement);
  }
  // Shadow DOM境界を越えてhost要素を辿る（inertはshadow treeにも波及する）
  const root = el.getRootNode();
  if (root instanceof ShadowRoot) {
    return isInInert(root.host);
  }
  return false;
};
