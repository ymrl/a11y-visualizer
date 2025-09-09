/**
 * 要素が視覚的に見えない状態かどうかを判定する
 * パフォーマンスを考慮し、より軽量な判定を優先する
 */
export const isOutOfSight = (
  element: Element,
  excludeElements: Element[] = [],
): boolean => {
  const win = element.ownerDocument?.defaultView;
  if (!win) return true;

  // 1. まず軽量なopacityチェック（自身と祖先要素）
  if (hasZeroOpacity(element)) {
    return true;
  }

  // 2. getBoundingClientRectで基本的な位置情報を取得
  const rect = element.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    return true;
  }

  // 3. elementFromPointによる判定（より重い処理）
  return !isVisibleByElementFromPoint(element, rect, excludeElements);
};

/**
 * 要素および祖先要素のopacityが0かどうかをチェック
 */
const hasZeroOpacity = (element: Element): boolean => {
  const win = element.ownerDocument?.defaultView;
  if (!win) return true;

  let current: Element | null = element;
  while (current && current !== element.ownerDocument?.documentElement) {
    const style = win.getComputedStyle(current);
    if (style.opacity === "0") {
      return true;
    }
    current = current.parentElement;
  }
  return false;
};

/**
 * elementsFromPointを使用して要素が視覚的に見えるかどうかをチェック
 */
const isVisibleByElementFromPoint = (
  element: Element,
  rect: DOMRect,
  excludeElements: Element[],
): boolean => {
  const win = element.ownerDocument?.defaultView;
  if (!win) return false;

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  let points: { x: number; y: number }[];

  // 幅または高さが2px以下の場合は中央点のみ評価
  if (rect.width <= 2 || rect.height <= 2) {
    points = [{ x: centerX, y: centerY }];
  } else {
    // 要素の4つの角、中央点、各辺の中点をチェック（1px内側）
    points = [
      // 4つの角（1px内側）
      { x: rect.left + 1, y: rect.top + 1 },
      { x: rect.right - 1, y: rect.top + 1 },
      { x: rect.left + 1, y: rect.bottom - 1 },
      { x: rect.right - 1, y: rect.bottom - 1 },
      // 中央点
      { x: centerX, y: centerY },
      // 各辺の中点（1px内側）
      { x: centerX, y: rect.top + 1 }, // 上辺の中点
      { x: rect.right - 1, y: centerY }, // 右辺の中点
      { x: centerX, y: rect.bottom - 1 }, // 下辺の中点
      { x: rect.left + 1, y: centerY }, // 左辺の中点
    ];
  }

  for (const point of points) {
    // elementsFromPointで全ての要素を取得
    const allElements = win.document.elementsFromPoint(point.x, point.y);
    if (!allElements || allElements.length === 0) continue;

    // Accessibility Visualizerの要素を除外
    const filteredElements = allElements.filter((el) => {
      return !el.closest("[data-a11y-visualizer-extension]");
    });

    if (filteredElements.length === 0) continue;

    // 最上位の要素（Accessibility Visualizer要素を除外した後）をチェック
    const topElement = filteredElements[0];

    // 除外要素かどうかをチェック
    const isExcluded = excludeElements.some(
      (exclude) => exclude.contains(topElement) || topElement.contains(exclude),
    );
    if (isExcluded) continue;

    // 対象要素自身の場合は表示されている
    if (topElement === element) {
      return true;
    }

    // 対象要素の子要素の場合は表示されている
    if (element.contains(topElement)) {
      return true;
    }

    // 対象要素が他の要素の子の場合、その要素が対象要素を含んでいても
    // 実際に見えるのは最上位の要素なので、対象要素は隠れている
  }

  return false;
};
