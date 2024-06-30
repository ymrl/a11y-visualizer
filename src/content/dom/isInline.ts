const hasInlineSibling = (el: Element): boolean => {
  let prev = el.previousSibling;
  let next = el.nextSibling;
  while (prev) {
    if (prev.nodeType === Node.TEXT_NODE) {
      if (prev.textContent?.trim()) {
        return true;
      }
    } else if (prev.nodeType === Node.ELEMENT_NODE) {
      const style = window.getComputedStyle(prev as HTMLElement);
      if (style.display.startsWith("inline")) {
        return true;
      }
      break;
    }
    prev = prev.previousSibling;
  }
  while (next) {
    if (next.nodeType === Node.TEXT_NODE) {
      if (next.textContent?.trim()) {
        return true;
      }
    } else if (next.nodeType === Node.ELEMENT_NODE) {
      const style = window.getComputedStyle(next as HTMLElement);
      if (style.display.startsWith("inline")) {
        return true;
      }
      break;
    }
    next = next.nextSibling;
  }
  return false;
};

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

  // テキスト、またはインラインの兄弟がいる場合はtrue
  if (hasInlineSibling(el)) {
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
