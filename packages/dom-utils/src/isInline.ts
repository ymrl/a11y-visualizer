const hasPreviousInlineSibling = (el: Element): boolean => {
  let prev = el.previousSibling;
  while (prev) {
    if (prev.nodeType === Node.TEXT_NODE) {
      if (prev.textContent?.trim()) {
        return true;
      }
    } else if (prev.nodeType === Node.ELEMENT_NODE) {
      const d = (prev as Element).ownerDocument;
      const w = d?.defaultView;
      if (!w) {
        return false;
      }
      const style = w.getComputedStyle(prev as HTMLElement);
      if (style.position === "absolute" || style.position === "fixed") {
        /* no op */
      } else if (
        style.display.startsWith("inline") &&
        prev.textContent?.trim()
      ) {
        return true;
      } else {
        break;
      }
    }
    prev = prev.previousSibling;
  }
  return false;
};

/**
 * 要素が文中のインライン要素として（テキストの流れの中に）表示されているか
 * どうかを判定する
 *
 * displayがinline系であることに加えて、前にテキストやインラインの兄弟が
 * あるか、自身がテキストを含むかなど、実際に文中に位置しているかを判定する。
 * WCAG 2.5.8 Target Size (Minimum) の「Inline」例外（文中のリンクなどは
 * ターゲットサイズ不足を問わない）の判定としてtarget-sizeルールで使う
 *
 * @param el - 対象の要素
 * @returns 文中のインライン要素として表示されている場合はtrue
 */
export const isInline = (el: Element): boolean => {
  if (!el.parentElement) {
    return false;
  }
  const d = el.ownerDocument;
  const w = d.defaultView;
  if (!w) return false;
  const style = w.getComputedStyle(el);
  const { display } = style;

  // inline で始まらないスタイルの場合はfalse
  if (!display.startsWith("inline")) {
    return false;
  }

  const parentStyle = w.getComputedStyle(el.parentElement);
  // 親スタイルがflexかgridの場合はinlineにならないのでfalse
  if (
    parentStyle.display.endsWith("flex") ||
    parentStyle.display.endsWith("grid")
  ) {
    return false;
  }

  const parentLineHeight =
    parentStyle.lineHeight === "normal"
      ? parseFloat(parentStyle.fontSize) * 1.2
      : parseFloat(parentStyle.lineHeight);
  const height = el.getBoundingClientRect().height;

  // 親要素の行の高さより大きいならfalse
  if (display !== "inline" && height > parentLineHeight) {
    return false;
  }

  // 自身よりも前にテキスト、またはインラインの兄弟がいる場合はtrue
  if (hasPreviousInlineSibling(el)) {
    return true;
  }

  // display: inlineで、テキストを含んでる場合はtrue
  if (display === "inline" && el.textContent?.trim()) {
    return true;
  }

  // 兄弟がいる場所まで遡る (spanが入れ子になってたりするので)
  if (!el.previousSibling && !el.nextSibling) {
    return isInline(el.parentElement);
  }
  return false;
};
