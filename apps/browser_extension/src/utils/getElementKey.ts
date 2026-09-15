const elementKeys = new WeakMap<Element, number>();
let nextElementKey = 0;

/**
 * 要素に対して安定したキーを発行する
 *
 * 同じ要素には常に同じキーを返す。要素の収集のたびに作り直される
 * ElementMetaをReactのkeyで安定的に要素へ対応付け、不要な
 * unmount/remountを防ぐために使う
 *
 * @param element - 対象の要素
 * @returns 要素に対応するキー
 */
export const getElementKey = (element: Element): number => {
  let key = elementKeys.get(element);
  if (key === undefined) {
    key = nextElementKey;
    nextElementKey += 1;
    elementKeys.set(element, key);
  }
  return key;
};
