export const isInline = (el: Element): boolean => {
  if (!el.parentElement) {
    return false;
  }
  const d = el.ownerDocument;
  const w = d.defaultView;
  if (!w) return false;
  const style = w.getComputedStyle(el);
  const parentTagName = el.parentElement.tagName.toLowerCase();

  // inline で始まらないスタイルの場合はfalse
  if (!style.display.startsWith("inline")) {
    return false;
  }

  // displayがinlneで、親が段落・テーブルセル・箇条書き、キャプション、見出しの場合はtrue
  if (
    style.display === "inline" &&
    [
      "p",
      "td",
      "th",
      "li",
      "dt",
      "dd",
      "caption",
      "figcaption",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
    ].includes(parentTagName)
  ) {
    return true;
  }

  const parentStyle = w.getComputedStyle(el.parentElement);
  // 親スタイルがflexかgridの場合はinlineにならないのでfalse
  if (
    parentStyle.display.endsWith("flex") ||
    parentStyle.display.endsWith("grid")
  ) {
    return false;
  }

  // 兄弟がいる場所まで遡る (spanが入れ子になってたりするので)
  if (!el.previousSibling && !el.nextSibling) {
    return isInline(el.parentElement);
  }
  return false;
};
