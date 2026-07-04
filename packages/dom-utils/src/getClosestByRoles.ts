import { getKnownRole } from "./getKnownRole";
import type { KnownRole } from "./KnownRole";

/**
 * 要素自身から祖先方向に辿り、指定されたロールのいずれかを持つ最も近い要素を取得する
 *
 * `Element.closest()` のロール版。テーブルセルから所属するテーブル
 * （table/grid/treegrid）を探す場合などに使う
 *
 * @param el - 起点となる要素（要素自身も判定対象に含まれる）
 * @param roles - 検索するロールの配列
 * @returns 該当する最も近い要素、見つからない場合はnull
 */
export const getClosestByRoles = (
  el: Element,
  roles: KnownRole[],
): Element | null => {
  const role = getKnownRole(el);
  if (role) {
    if (roles.includes(role)) {
      return el;
    }
  }

  const parent = el.parentElement;
  if (!parent) {
    return null;
  }
  return getClosestByRoles(parent, roles);
};
