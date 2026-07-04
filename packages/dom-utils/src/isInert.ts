/**
 * 要素自身がinert（不活性）に指定されているかどうかを判定する
 *
 * inert属性、またはCSSの `interactivity: inert` を検出する。
 * 祖先は判定しない。祖先も含めて判定する場合は {@link isInInert} を使う
 *
 * @param el - 対象の要素
 * @returns inertに指定されている場合はtrue
 */
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

/**
 * 要素がinert（不活性）の影響下にある（自身または祖先がinertである）
 * かどうかを判定する
 *
 * 祖先の探索はShadow DOM境界を越えてhost要素を辿る。
 * inertルールでの表示や、ライブリージョンの読み上げ対象外の判定に使う
 *
 * @param el - 対象の要素
 * @returns 自身または祖先がinertの場合はtrue
 */
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
