import { getClosestByRoles } from "./getClosestByRoles";
import type { KnownRole } from "./KnownRole";

const ChildrenPresentationalRoles: KnownRole[] = [
  "button",
  "checkbox",
  "img",
  "menuitemcheckbox",
  "menuitemradio",
  "meter",
  "option",
  "progressbar",
  "radio",
  "scrollbar",
  "separator",
  "slider",
  "switch",
  "tab",
] as const;

/**
 * 要素が、子孫をプレゼンテーショナル（アクセシビリティツリーに公開しない）
 * として扱うロールの内側にあるかどうかを判定する
 *
 * WAI-ARIAで「Children Presentational: True」と定義されるロール
 * （button・checkbox・imgなど）またはbutton要素の子孫かどうかを判定する。
 * 該当する要素は支援技術に個別の要素として公開されないため、
 * image-nameやsvg-skipなどのルールで評価対象外の判定に使う
 *
 * @param el - 対象の要素
 * @returns プレゼンテーショナルな子孫として扱われる場合はtrue
 */
export const isPresentationalChildren = (el: Element): boolean =>
  !!(
    el.parentElement &&
    (getClosestByRoles(el.parentElement, ChildrenPresentationalRoles) ||
      el.parentElement.closest("button"))
  );
