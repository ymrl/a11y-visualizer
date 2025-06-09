interface Window {
  getDefaultComputedStyle?: (
    elt: Element,
    pseudoElt?: string | null,
  ) => CSSStyleDeclaration;
}
