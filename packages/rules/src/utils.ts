import { getKnownRole } from "@a11y-visualizer/dom-utils";
import type { RuleObject, RuleResult } from "./type";

/**
 * 要素がルールの評価対象かどうかを判定する
 *
 * ルールに定義された `tagNames`・`roles`・`selectors` のいずれかにマッチ
 * するかで判定する。いずれも定義されていないルールはすべての要素が対象。
 * `evaluate` を呼び出す前の事前フィルタリングとして使う
 *
 * @param element - 対象の要素
 * @param ruleObject - 判定するルール
 * @param role - 要素のロール（計算済みの場合に渡すと再計算を省略できる）
 * @returns ルールの評価対象の場合はtrue
 */
export const isRuleTargetElement = (
  element: Element,
  ruleObject: RuleObject,
  role: string | null = getKnownRole(element),
): boolean => {
  const tagName = element.tagName.toLowerCase();
  if (!ruleObject.roles && !ruleObject.tagNames && !ruleObject.selectors)
    return true;
  if (ruleObject.tagNames?.includes(tagName)) return true;
  if (ruleObject.roles && role && ruleObject.roles.includes(role)) return true;
  if (ruleObject.selectors && element.matches(ruleObject.selectors.join(",")))
    return true;
  return false;
};

/**
 * 評価結果を識別する文字列を生成する
 *
 * 同じ要素に対する評価結果の一覧を表示する際の重複判定や、
 * Reactのkeyとして使う
 *
 * @param result - 評価結果
 * @returns 評価結果の種類と内容から生成した識別文字列
 */
export const getRuleResultIdentifier = (result: RuleResult): string => {
  switch (result.type) {
    case "error":
    case "warning":
      return `${result.type}-${result.ruleName}-${result.message}`;
    case "state":
      return `${result.type}-${result.state}`;
    case "ariaAttributes":
      return "ariaAttributes";
    default:
      return `${result.type}-${result.content}`;
  }
};
